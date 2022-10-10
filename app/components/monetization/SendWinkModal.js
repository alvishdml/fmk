import React, { Component } from 'react';
import { AppEventsLogger } from 'react-native-fbsdk';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Alert from '../../utilities/Alert';
import InAppBilling from 'react-native-billing';
import branch from 'react-native-branch';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  trackScreen,
  trackEvent,
  trackRevenue,
} from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const purchaseIdDisc = [
  'com.playfmk.30winksdisc',
  'com.playfmk.20winksdisc',
  'com.playfmk.10winksdisc',
];
const purchaseId = [
  'com.playfmk.30winks',
  'com.playfmk.20winks',
  'com.playfmk.10winks',
];

export default class SendWinkModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      masgTitle: '',
      msgCopy: '',
      msgPercentage: '',
      isOpen: false,
      prices: ['', '', ''],
      normalPrices: ['', '', ''],
      selected: 0,
    };
  }

  loadPrices() {
    Meteor.call('showDiscount', Meteor.user()._id, async (err, val) => {
      if (!err && val) {
        // Show discounted prices
        this.setState({
          showDiscount: true,
          reason: val.reason,
          msgTitle: val.msgTitle,
          msgCopy: val.msgCopy,
          msgPercentage: val.msgPercentage,
        });
        await InAppBilling.close();
        try {
          // await InAppBilling.open();
          var prices = [];
          for (var i = 0; i < 3; i++) {
            var pricesLine = [];
            var selectedIds = purchaseIdDisc;
            var products = await InAppBilling.getProductDetailsArray(
              selectedIds
            );
            for (var j in products) {
              pricesLine.push(
                products[j].introductoryPriceText || products[j].priceText
              );
            }
            prices.push(pricesLine);
          }
          var normalPrices = [];
          for (var i = 0; i < 3; i++) {
            var pricesLine = [];
            var selectedIds = purchaseId;
            var products = await InAppBilling.getProductDetailsArray(
              selectedIds
            );
            for (var j in products) {
              pricesLine.push(
                products[j].introductoryPriceText || products[j].priceText
              );
            }
            normalPrices.push(pricesLine);
          }
          this.setState({ prices, normalPrices });
        } catch (err) {
        } finally {
          await InAppBilling.close();
        }
      } else if ((!err && val == false) || (err && err.error == 404)) {
        this.setState({ showDiscount: false });
        await InAppBilling.close();
        try {
          // await InAppBilling.open();
          var prices = [];
          var pricesLine = [];
          var selectedIds = purchaseId;
          var products = await InAppBilling.getProductDetailsArray(selectedIds);
          for (var j in products) {
            pricesLine.push(
              products[j].introductoryPriceText || products[j].priceText
            );
          }
          prices.push(pricesLine);
          this.setState({ prices });
        } catch (err) {
          firebase
            .crash()
            .isCrashCollectionEnabled()
            .then(enabled => {
              if (enabled) {
                firebase.crash().log(`
                    MonetizationSlideShowTab.js:loadPrices()
                    Something went wrong getting prices
                    userID => ${Meteor.user()._id}
                    `);
                firebase.crash().report(err);
              }
            });
        } finally {
          await InAppBilling.close();
        }
      }
    });
  }

  compareProductsDesc(a, b) {
    if (a.priceValue < b.priceValue) return 1;
    if (a.priceValue > b.priceValue) return -1;
    return 0;
  }

  updatePurchased() {
    Meteor.call('purchasedItems', Meteor.user()._id, (err, result) => {
      if (!err) {
        this.setState({ purchased: result, downloadPurchased: true });
      }
    });
  }
  // To be sure the service is close before opening it
  async pay(product, category, qty, price) {
    await InAppBilling.close();
    try {
      // await InAppBilling.open();
      const own = await InAppBilling.listOwnedProducts();

      if (category != 'subscription' && own.indexOf(product) != -1) {
        await InAppBilling.consumePurchase(product);
      }
      if (
        !(await InAppBilling.isPurchased(product)) ||
        (category == 'subscription' && !isSubscribed)
      ) {
        let details;
        if (category == 'subscription') {
          details = await InAppBilling.subscribe(product);
        } else {
          details = await InAppBilling.purchase(product);
        }
        var receipt = {
          data: details.receiptData,
          signature: details.receiptSignature,
        };
        Meteor.call(
          'purchaseItem',
          Meteor.user()._id,
          product,
          category,
          qty,
          'androidApp',
          receipt,
          (err, res) => {
            if (!err) {
              trackEvent('Monetization', 'BuyCompleted', product);

              if (isNaN(qty)) {
                category = category + ' - ' + qty;
                qty = 5;
              }

              trackRevenue({
                product,
                category,
                price,
                quantity: qty,
                id: details.orderId,
              });
              // GoogleAnalytics.trackPurchaseEvent({
              //   id: product,
              //   name: category,
              //   price: price/10000,
              //   quantity: parseInt(qty)
              // }, {
              //   id: details.orderId
              // }, 'Monetization', 'Purchase');
              // AppEventsLogger.logPurchase(price/10000, 'EUR', { product, category, quantity: parseInt(qty) });
              Alert.showAlert(
                I18n.t(
                  'app.components.monetization.MonetizationSlideShowTab.purchaseAlert0'
                ),
                I18n.t(
                  'app.components.monetization.MonetizationSlideShowTab.purchaseAlert1'
                ),
                'purchaseCompleted'
              );
              this.props.mainPage.bought(product);
              this.props.mainPage.downloadPowerVoteCount();
              this.openPopUp(false);
            } else {
              console.log(err);
              trackEvent('Monetization', 'BuyVerificationFailed', {
                label: product,
                value: price,
              });
              Alert.showAlert(
                '',
                I18n.t(
                  'app.components.monetization.MonetizationSlideShowTab.purchaseAlertError'
                )
              );
            }
          }
        );
      }
    } catch (err) {
      firebase
        .crash()
        .isCrashCollectionEnabled()
        .then(enabled => {
          firebase.crash().log(`
              MonetizationSlideshowTab.js:pay()
              userID => ${Meteor.user()._id}
              product => ${product}
              category => ${category}
              quantity => ${qty}
              price => ${price}
              `);
          firebase.crash().report(err);
        });

      if (err.message == 'Purchase or subscribe failed with error: 110') {
        trackEvent('Monetization', 'BuyFailed', {
          label: product,
          value: price,
        });
        Alert.showAlert(
          '',
          I18n.t(
            'app.components.monetization.MonetizationSlideShowTab.purchaseOperationError'
          )
        );
      }
    } finally {
      await InAppBilling.close();
      this.updatePurchased();
    }
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
    if (value == true) {
      trackScreen('Send_Wink_Screen');
      this.updatePurchased();
      this.loadPrices();
    }
  }

  render() {
    return (
      <Modal
        onDismiss={() => {
          this.setState({ isOpen: false });
        }}
        offset={0}
        hideCloseButton={false}
        backdropType="blur"
        isVisible={this.state.isOpen}
        style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
      >
        <View style={styles.mainView}>
          <LinearGradient
            style={{
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              width: WIDTH - 80,
              height: HEIGHT * 0.3,
              position: 'absolute',
              top: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            colors={['#F97C7F', '#F78814']}
          >
            <Image
              resizeMode="contain"
              resizeMethod="resize"
              source={{
                uri:
                  'https://fmk-images.ams3.digitaloceanspaces.com/defaults/wink.png',
              }}
              style={{
                height: WIDTH * 0.2,
                width: WIDTH * 0.6,
                marginRight: 10,
                marginLeft: 15,
                marginTop: 10,
              }}
            />
            <Text
              style={{
                fontFamily: 'Montserrat-Light',
                color: '#fff',
                fontSize: 35,
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              {I18n.t(
                'app.components.monetization.MonetizationSlideShowTab.winkTitle'
              )}
            </Text>
          </LinearGradient>
          <Text
            style={{
              fontFamily: 'Montserrat-Light',
              color: 'black',
              fontSize:
                I18n.locale == 'en-US' || I18n.locale == 'en-EN'
                  ? WIDTH * 0.04
                  : WIDTH * 0.035,
              marginTop: HEIGHT * 0.3,
              textAlign: 'center',
            }}
          >
            {I18n.t(
              'app.components.monetization.MonetizationSlideShowTab.winksDesc'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: WIDTH,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <PriceBox
              type="winks"
              qty="30"
              price={this.state.prices[0][2]}
              normalPrice={this.state.normalPrices[0][2]}
              unit="Winks"
              selected={this.state.selected}
              container={this}
              num={0}
              showDiscount={this.state.showDiscount}
            />
            <PriceBox
              type="winks"
              qty="20"
              price={this.state.prices[0][1]}
              normalPrice={this.state.normalPrices[0][1]}
              unit="Winks"
              selected={this.state.selected}
              container={this}
              num={1}
              showDiscount={this.state.showDiscount}
            />
            <PriceBox
              type="winks"
              qty="10"
              price={this.state.prices[0][0]}
              normalPrice={this.state.normalPrices[0][0]}
              unit="Winks"
              selected={this.state.selected}
              container={this}
              num={2}
              showDiscount={this.state.showDiscount}
            />
          </View>
          <TouchableOpacity
            style={{
              width: WIDTH - 150,
              height: 50,
              backgroundColor: '#F78814',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
              marginBottom: 30,
            }}
            onPress={async function() {
              trackEvent('Send_Wink_Screen', 'Click_buy');
              let qty;
              let price;
              if (this.state.selected == 0) {
                qty = '30';
                price =
                  Number(this.state.prices[0][2].replace(/[^0-9\.-]+/g, '')) *
                  100;
              } else if (this.state.selected == 1) {
                qty = '20';
                price =
                  Number(this.state.prices[0][1].replace(/[^0-9\.-]+/g, '')) *
                  100;
              } else {
                qty = '10';
                price =
                  Number(this.state.prices[0][0].replace(/[^0-9\.-]+/g, '')) *
                  100;
              }
              price = Math.ceil(price);

              var selectedId = purchaseId[this.state.selected];
              if (this.state.showDiscount) {
                selectedId = purchaseIdDisc[this.state.selected];
              }

              trackEvent('Monetization', 'BuyClicked', {
                label: selectedId,
                value: price,
              });

              var purchasedCollection = this.state.purchased;

              this.pay(selectedId, 'winks', qty, price);
            }.bind(this)}
          >
            <Text
              style={{
                fontFamily: 'Montserrat-Light',
                color: 'white',
                fontSize: I18n.locale != 'pt-BR' ? WIDTH * 0.04 : WIDTH * 0.03,
                fontWeight: '400',
              }}
            >
              {I18n.t(
                'app.components.monetization.MonetizationSlideShowTab.winkStart'
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ isOpen: false });
              trackEvent('Send_Wink_Screen', 'Click_Maybe_Later');
            }}
          >
            <Text
              style={{
                fontFamily: 'Montserrat-Light',
                color: '#353535',
                textDecorationLine: 'underline',
                fontSize: 12,
              }}
            >
              {I18n.t('app.components.monetization.ActivateBoost.maybeLater')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: HEIGHT * 0.83,
    marginRight: 40,
    marginLeft: 40,
    borderRadius: 5,
    position: 'relative',
  },
  activateButton: {
    width: 400,
    height: 100,
  },
});

class PriceBox extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.container.state.showDiscount) {
      trackEvent('Monetization', 'BoxClicked', {
        label: 'com.playfmk.30winksdisc',
        value: parseInt(this.props.qty),
      });
    } else {
      trackEvent('Monetization', 'BoxClicked', {
        label: 'com.playfmk.30winks',
        value: parseInt(this.props.qty),
      });
    }
  }

  render() {
    var WIDTH = Dimensions.get('window').width;
    var HEIGHT = Dimensions.get('window').height - 60;
    var borderColor = 'transparent';

    var price = this.props.price;
    if (this.props.type == 'subscription' && this.props.price) {
      // console.log('price: ', this.props.price);
      var priceNum = Number(this.props.price.replace(/[^0-9\.-]+/g, ''));
      // console.log('price after regex: ', priceNum);
      if (this.props.qtyCalc) {
        // console.log('quantity: ', this.props.qtyCalc);
        price = priceNum / this.props.qtyCalc;
      } else {
        price = priceNum / this.props.qty;
      }
      // console.log('final price: ', price);

      if (priceNum > 450) {
        // console.log('DIVIDE BIG NUMBER');
        price = price / 100;
      } else {
        // for prices per week
        // price = price*100;
      }

      //console.log('final price 2: ', price);

      // Temporary 50% discount
      // price = Math.ceil(price/2) - 0.01;
      const finalPrice = Math.floor(price * 100) / 100;
      // Math.floor(a * 100) / 100
      price = '€' + finalPrice + '/week';
    }

    let backgroundColor = 'transparent';
    let lineColor = 'transparent';
    const productColor = '#F78531';
    if (this.props.selected == this.props.num) {
      lineColor = this.props.color;
      (backgroundColor = '#ffffff'), (borderColor = productColor);
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.container.setState({ selected: this.props.num });
            if (!isNaN(this.props.qty)) {
              var selectedId = purchaseId[this.props.container.state.selected];
              if (this.props.container.state.showDiscount) {
                selectedId =
                  purchaseIdDisc[this.props.container.state.selected];
              }
              trackEvent('Monetization', 'BoxClicked', {
                label: selectedId,
                value: parseInt(this.props.qty),
              });
            }
          }}
          style={{
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 4,
            borderStyle: 'solid',
            height: 100,
            width: WIDTH * 0.24,
            margin: 5,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                color: '#424242',
                margin: 0,
                fontFamily: 'Montserrat-Bold',
                fontSize: 28,
              }}
            >
              {this.props.qty}
            </Text>
            <Text
              style={{
                color: '#424242',
                margin: 0,
                textAlign: 'center',
                fontSize: WIDTH * 0.03,
              }}
            >
              {this.props.unit}
            </Text>
          </View>
          {this.props.showDiscount && (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  color: 'black',
                  margin: 0,
                  fontSize: 12,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}
              >
                {this.props.normalPrice}
              </Text>
              <Text
                style={{ color: productColor, fontWeight: '900', fontSize: 18 }}
              >
                {price}
              </Text>
            </View>
          )}
          {!this.props.showDiscount && (
            <Text style={{ color: 'black', margin: 0 }}>
              {price}
              {this.props.type == 'complete' && (
                <Text style={{ fontSize: 10 }}>
                  {I18n.t(
                    'app.components.monetization.MonetizationSlideShowTab.mostPopular'
                  )}
                </Text>
              )}
            </Text>
          )}
          {/* {this.props.price != -1 && (
            <View style={{ height: 1, width: WIDTH * 0.8, margin: 5 }} />
          )} */}
          {/* {this.props.price != -1 && (
            <Text style={{ color: 'black', margin: 0 }}>
              {price}
              {this.props.type == 'complete' && (
                <Text style={{ fontSize: 10 }}>
                  {I18n.t(
                    'app.components.monetization.MonetizationSlideShowTab.mostPopular'
                  )}
                </Text>
              )}
            </Text>
          )} */}
        </TouchableOpacity>
      </View>
    );
  }
}
