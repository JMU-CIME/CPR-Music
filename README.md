1. clone
1. npm i
1. create .env.local with content like this
    - `SECRET=<RANDOM STRING>`
1. `npm run dev`
1. If you push to main, it will re-deploy to dev.tele.band
    * the continuous deploy setup was created following [the steps detailed here](https://itnext.io/deploy-next-js-apps-using-github-actions-6322261757bc)
        * if the dev site loads, but fails to permit login, possibly the server's `.env.local` was removed/doesn't exist
        * beware: it seems that sometimes some pushed commits do not trigger the action 🤷
