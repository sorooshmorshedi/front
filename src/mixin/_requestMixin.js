import axios from 'axios';
import FillStore from '@/utils/fillStore'

export default {
    mixins: [FillStore],
    methods: {
        //getServerUrl() {
        //let serverUrl = 'https://api.app.sobhan.net/'
        //if(window.location.hostname == '5.182.44.120') {
        //serverUrl = "http://5.182.44.120:8082/"
        //}
        //if(window.location.hostname == '188.121.108.201') {
        //serverUrl = "http://188.121.108.201:40/"
        //}
        //if (this.isDev) {
        //serverUrl = localStorage.getItem('serverUrl');
        //if (!serverUrl) serverUrl = 'http://localhost:7000/'
        //}
        //return serverUrl
        //},
        getServerUrl() {
            return 'http://127.0.0.1:7000/' ///return 'http://188.121.108.201:40/'
        },
        endpoint(url) {
            return this.getServerUrl() + url;
        },
        fetchStoreData({
                           url,
                           storeKey,
                           force = false,
                           callback = null,
                       }) {

            let storeData = this.$store.state[storeKey]
            if (!force && storeData.length) return;
            if (!this.canGet(storeKey)) return;

            return this.request({
                url: this.endpoint(url),
                method: 'get',
                success: data => {
                    let mutationKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1)
                    this.$store.commit(`set${mutationKey}`, data);

                    callback && callback();

                    this.EventBus.$emit(`fetched:${storeKey}`);
                    this.toggleIsGetting(storeKey)
                }
            })


        },
        request(options) {

            if (options.loading != false) this.$store.commit('incrementOGR');

            let headers = {};

            if (options.token != false) this.appendToken(headers);

            if (!options.method) {
                options.method = 'get';
            }

            new Promise((resolve, reject) => {

                axios.defaults.timeout = 600 * 100 * 5

                let client = axios

                client.request({
                    headers: headers,
                    url: options.url,
                    method: options.method,
                    data: options.data,
                    params: options.params,
                })
                    .then((res) => {
                        this.$store.commit('decrementOGR');
                        let data = res.data;
                        if (data.token) {
                            this.setToken();
                        }

                        options.success(res.data);
                        // resolve()
                    })
                    .catch((error) => {
                        this.$store.commit('decrementOGR');

                        if (options.error) {
                            options.error(error);
                        } else {
                            this.handleError(error, options);
                        }
                    });

            })
        },
        handleError(error, options) {
            if (error.response) {
                let statusCode = error.response.status
                if (statusCode == 401) this.handle_401(error);
                else if (statusCode == 403) this.handle_403(error);
                else if (statusCode == 400) this.handle_400(error);
                else if (statusCode == 404) this.handle_404(error, options);
                else if (statusCode == 406) this.handle_406(error, options);
                else if (statusCode == 429) this.handle_429(error, options);
            } else {
                this.handle_noResponse(error, options);
            }
        },
        appendToken(headers) {
            if (!this.token) {
                console.warn('user is not login');
            } else {
                headers["Authorization"] = "Token " + this.token;
            }
        },
        handle_403(error) {
            this.notify(error.response.data[0].messages[0], 'warning');
        },
        handle_401(error) {
            if (this.$router.currentRoute.name == 'Login') return;
            this.notify('شما از سامانه خارج شده اید', 'warning');
            this.setToken('');
            this.$router.push({
                name: "Login",
                query: {
                    redirectUrl: this.$route.fullPath
                }
            });
        },

        handle_404(error, options) {
            this.notify('مورد وجود ندارد', 'warning');
        },
        handle_400(error) {
            let errors = error.response.data;
            for (const error in errors) {
                console.log(typeof errors[error])
                let message = ""
                if (typeof (error) == typeof ("")) {
                    if (errors[error][0] == undefined) {
                        message = errors[error].messages[0]
                    } else {
                        message = error + ' : ' + errors[error][0]
                    }

                } else if (error.field == 'non_field_errors' || error.field == '') {
                    message = error
                    console.log(2)

                } else {
                    message = error.field + ' : ' + error.messages, 'danger'
                }
                this.notify(message, 'danger');
                break;
            }
        },
        handle_406(error, options) {
            let confirmations = error.response.data;

            for (const text of confirmations) {
                if (!confirm(text.messages[0])) return;
            }
            if (options.data) options.data._confirmed = true;
            else options.data = {
                _confirmed: true
            }
            this.request(options);
        },
        handle_429(error, options) {
            this.notify('تعداد درخواست های شما بیش از حد مجاز است', 'danger');
        },
        handle_noResponse(error, options) {
            console.warn('NO RESPONSE FROM SERVER: ', options.url);
            console.warn(error)
            alert('خطا در برقراری ارتباط با سرور');
            return;
        }

    }

}