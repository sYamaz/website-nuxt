# migrate from nuxt2 to nuxt3

https://nuxt.com/docs/bridge/overview#upgrade-nuxt-2

* lockファイルを削除する
* package.jsonからnuxtを削除し、最新のnuxt-edgeをインストールする

```
yarn remove nuxt
yarn add nuxt-edge
```

* yarn installする
* nuxt bridgeをインストールする

```
yarn add --dev @nuxt/bridge@npm:@nuxt/bridge-edge
```
