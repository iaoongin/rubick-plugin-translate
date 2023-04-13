const crypto = require('crypto');

rubick.onPluginReady(({
    code,
    type,
    payload
}) => {
    console.log('插件装配完成，已准备好')
    console.log(payload)
    translate(payload)

    rubick.setSubInputValue(payload)
})


rubick.setSubInput(({
    text
}) => {
    console.log(text)
    translate(text)

}, '搜索')

function translate(word) {
    base_url = 'https://dict.iciba.com/dictionary/word/query/web'

    word = encodeURIComponent(word)

    query_data = {
        'c': 'trans',
        'm': 'fy',
        'client': '6',
        'auth_user': 'key_web_fanyi',
        'sign': '',
    }

    let ts = new Date().getTime();

    query_data = {
        "client": "6",
        "key": "1000006",
        "timestamp": ts,
        "word": word,
        "signature": '',
    }

    const hashKey = '7ece94d9f9c202b0d2ec557dg4r9bc'
    const hashMessageBody = `61000006${ts}${word}`
    const hashMessage = `/dictionary/word/query/web${hashMessageBody}${hashKey}`

    sign_str = crypto.createHash('md5').update(hashMessage).digest('hex');

    console.log(sign_str)
    // query_data['sign'] = sign_str[:16]
    query_data['signature'] = sign_str

    fetch(base_url + "?" + objectToQueryString(query_data))
        .then(b => b.json())
        .then(resp => {
            console.log(resp)
            let result = document.getElementById('result')
            let baseInfo = resp.message.baesInfo
            let html = ``

            if (baseInfo.symbols) {

                html += `<h3>${baseInfo.word_name}</h3>`
                let parts = baseInfo.symbols[0].parts

                for (var idx in parts) {
                    let part = parts[idx]
                    html += `<div>${part.part}<div>`
                    html += `<div>${part.means.join('; ')}<div>`
                }
            } else {
                html += `<h3>${resp.message.word_name}</h3>`
                html += `<div>${baseInfo.translate_result}<div>`
                html += `<div class='gray'>${baseInfo.translate_msg}<div>`
            }


            result.innerHTML = html
        })
        .catch(error => console.error(error));
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
}