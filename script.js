const button = document.getElementById('button');
const audioElement = document.getElementById('audio');


// VoiceRSS Javascript SDK
const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};

// Activer/desactiver le bouton
function toggleButton() {
    button.disabled = !button.disabled;
}

// Donne la blague au VoiceRSS API
function tellMe(joke) {
    VoiceRSS.speech({
        key: '7891739072df47fc964ab4f5c6cc733c',
        src: joke,
        hl: 'fr-fr',
        v: 'Zola',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
    console.log('tell me: ', joke);
}

// Obtenir des blagues depuis le BlaguesAPI
async function getJokes() {
    let joke = '';
    const apiUrl = 'https://www.blagues-api.fr/api/random?disallow=dark&disallow=limit&disallow=blondes&disallow=beauf';
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjc3MTY0ODQ2NjM2NzI4MzIwIiwibGltaXQiOjEwMCwia2V5IjoiTVBRTVBmSWJod2ZVSk9zSndHNUdadjFHN1lJaHBEcUpKcGlreGVyajNuNmlUTWFpSmsiLCJjcmVhdGVkX2F0IjoiMjAyMS0wOS0yNlQxNTo0NTozMSswMDowMCIsImlhdCI6MTYzMjY3MTEzMX0.t-sRMrNm7zcw9Wy1NLxJqUD5nspndDNQ30AmHA8i8SE`
            }
        });
        const data = await response.json(); 
        joke = `${data.joke} ... ${data.answer}`;
        // Text to speech
        tellMe(joke);
        // Desactive le bouton
        toggleButton();
    } catch (error) {
        // Attrape ici les erreurs
        console.log('oups', error)
    }
}

// Event Listeners
button.addEventListener('click', getJokes);
audioElement.addEventListener('ended', toggleButton);