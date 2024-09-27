export class globalProperties{
    public static genericError: string = 'Something went wrong. Please try again later.'

    public static nameRegx: string = '([a-zA-Z0-9 ]*)'

    public static toastrConfig = {
        maxOpened: 0,
        preventDuplicates :true,
        closeButton: true,
        timeOut : 5000,
        easing: 'ease-in',
        progrssBar: true,
        toastClass: 'ngx-toastr',
        positionClass: 'toast-top-right',
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        topToDismiss: true
    }

    public static secret_key = '14fbe5ec2c68bb7beca1d8d4b7f98aac353924ac4732d26bdc47de67854d16beeaec5639f5328a914fb33c271bb39c6eebc26fe56c233e2e6f3dd5b7a9a482c9c915ec4301b20502a6d8094eb2a9fb00559cfea84a93739bbab160813a636718ffcad0da843f238977bb06659f0cff871b071fd3e40fff5d908f57e3c10263d5'

}