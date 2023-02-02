
# Choir

Colaborative repository for choir lyrics

  

## Instalation

Run `npm update` in your source directory to download the needed libraries.

This software uses Vue Router with history mode. [Check the doc](https://router.vuejs.org/guide/essentials/history-mode.html)

This software uses Vue CLI to runs and builds. [Check the doc](https://cli.vuejs.org/guide/cli-service.html)

This software uses a Proxy to redirect HTTP sources to HTTPS through the url `/assets/external?url=`. 
Here is an exemple for Nginx :
```
location /assets/external {
	resolver 8.8.8.8;
	proxy_pass $arg_url;
	proxy_redirect off;
}
```