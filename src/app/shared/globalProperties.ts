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
}