export class RoutesConstants {


  //Comon
  static readonly login = '/login'
  static readonly register = '/registrar'
  static readonly passwordRecoverEmail = '/recuperar-senha-email'
  static readonly passwordRecover = '/recuperar-senha/'
  static readonly emailVerification = '/verificacao-email/'
  static readonly admin = '/admin'

  static readonly home = '/'

  //-- relative 
  static readonly relHomeDetails = `casas/detalhes/`
  static readonly relHomeSearch = `casas/descobrir`
  static readonly relFavorits = `casas/favoritos`
  static readonly relAccount = `conta`

  //layout
  static readonly relManage = `gerenciador/casas`

  static readonly relManageAnounce = `anunciar`
  static readonly relManageInfoHome = `info/`
  static readonly relManageHistory = `historico`
  static readonly relManegePeddidngs = `pendentes`


  //-- absolute 
  static readonly homeDetails = `${this.home}${this.relHomeDetails}`
  static readonly homeSearch = `${this.home}${this.relHomeSearch}`
  static readonly favorits = `${this.home}${this.relFavorits}`
  static readonly account = `${this.home}${this.relAccount}`

  static readonly manageAnounce = `${this.home}${this.relManage}/${this.relManageAnounce}`
  static readonly manageInfoHome = `${this.home}${this.relManage}/${this.relManageInfoHome}`
  static readonly manageHistory = `${this.home}${this.relManage}/${this.relManageHistory}`
  static readonly managepeddings = `${this.home}${this.relManage}/${this.relManegePeddidngs}`
  static readonly manage = `${this.home}${this.relManage}`

  //ADMINS
  //-- relatives routes
  static readonly relHomeAdmin = 'home'

  //-- absolute routes
  static readonly homeAdmin = `${this.admin}/${this.relHomeAdmin}`


}