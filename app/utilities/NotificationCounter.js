export default class NotificationCounter {

  static setTabBar(tab) {
    this.tabBar = tab;
  }

  static goToPage(i) {
    if(this.tabBar){
      this.tabBar.props.goToPage(i);
    }
  }

  static getTabBar() {
    return this.tabBar;
  }

  static refreshNotification(){
    if(this.tabBar){
      this.tabBar.refreshNotification();
    }
  }

  static newNotification() {
    try {
      if (this && this.tabBar) {
        this.tabBar.newNotification();
      }
    } catch (error) {
      console.log(error);
    }
  }

  static clearNotification() {
    if(this.tabBar){
      this.tabBar.clearNotification();
    }
  }

  static subtractNotification() {
    if(this.tabBar)
    this.tabBar.subtractNotification();
  }

  static shareCombination() {
    // console.log(this);
  }

}

NotificationCounter.tabBar = 'cenas';
