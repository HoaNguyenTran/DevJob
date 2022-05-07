declare namespace Store {
  interface State {
    user: UserGlobal.UserState
    initData: InitDataGlobal.InitDataState
    mqtt: any
    userCompany: any
    notification: INotification
  }

  type RootState = State
}
