(function () {
  'use strict';

  const questUrl = prompt("Enter quest URL:");
  const type = prompt("Enter type: normal, backlink, changecolor").toLowerCase();
  const rid = Math.floor(Math.random() * 900000 + 100000).toString();

  const headers = {
    'origin': questUrl,
    'referer': questUrl,
    'rid': rid,
    'user-agent': navigator.userAgent
  };

  const endpoint = type === "backlink"
    ? 'https://linktot.net/ping_backlink.php'
    : 'https://linktot.net/ping.php';

  fetch(endpoint, {
    method: "OPTIONS",
    headers: headers
  })
    .then(res => {
      if (res.status === 200) {
        console.log("✅ Ping thành công, đợi 100 giây...");
        return new Promise(r => setTimeout(r, 100000)); // 100s
      } else {
        throw new Error("❌ Ping thất bại");
      }
    })
    .then(() => {
      const postHeaders = {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': questUrl,
        'referer': questUrl,
        'rid': rid,
        'user-agent': navigator.userAgent
      };

      return fetch('https://linktot.net/get-code.php', {
        method: 'POST',
        headers: postHeaders,
        body: JSON.stringify({
          href: questUrl,
          hostname: questUrl
        })
      });
    })
    .then(res => res.json())
    .then(data => {
      const encoded = data.code;
      const decoded = atob(encoded);
      const key = "1ThDrStTr";
      let final = "";

      for (let i = 0; i < decoded.length; i++) {
        final += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }

      console.log("✅ Giải mã được:", final);
      alert("✅ Link thật: " + final);
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Lỗi: " + err.message);
    });

})();