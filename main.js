document.addEventListener("DOMContentLoaded", function () {

const nav = document.querySelector(".top-nav");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const closeBtn = document.querySelector(".close-btn");
const searchIcon = document.querySelector(".search-icon");
const searchContainer = document.querySelector(".search-container");
const elemBody = document.querySelector("body");

hamburgerMenu.addEventListener("click", function () {
    nav.classList.add("active");
});

closeBtn.addEventListener("click", function () {
    nav.classList.remove("active");
});

searchIcon.addEventListener("click", function (event) {
    event.stopImmediatePropagation();
    searchContainer.classList.toggle("active");
});

elemBody.addEventListener("click", function (event) {
    if (searchContainer.classList.contains("active") &&
        !searchContainer.contains(event.target)
    ) {
        searchContainer.classList.remove("active");
    }
});



const topics = [
    { label: "Blogger", elementId: "blogger-posts" },
    { label: "新規就農", elementId: "farming-posts" },
    { label: "顎変形症", elementId: "jaw-deformities-posts" }
];

topics.forEach(topic => {
    const feedUrl = `https://toahagi.blogspot.com/feeds/posts/default/-/${encodeURIComponent(topic.label)}?alt=json&max-results=6`;

    fetch(feedUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            const entries = data.feed.entry || [];
            const container = document.getElementById(topic.elementId);

            let count = 0;

            for (let i = 0; i < entries.length; i++) {
                if (count >= 6) break;

                const entry = entries[i];
                const title = entry.title.$t;

                const linkObj = entry.link.find(function (link) {
                    return link.rel === "alternate"
                });


                // リンクを探す
                const link = linkObj.href || "#";

                // content または summary を使って本文要約を作る
                const content = entry.content?.$t || entry.summary?.$t || "";
                const summary = content.replace(/<[^>]+>/g, "").substring(0, 80);

                // 日付を整形
                const dateObj = new Date(entry.published.$t);
                const date = dateObj.toLocaleDateString();
                const isoDate = dateObj.toISOString();

                //サムネイルを取得
                const media = entry.media$thumbnail;
                const img = media ? media.url : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXN38RVcvmY7vKbwUw98jbel2wEDlpsa92aJPfNvmM_BlPYyxG86qfq8ZZhvM1pxvPIWP4DFmdh7phZs-OBKSfzgDWRnUO_X1TcA9238ngHbPMhZNkJPckt_FnMbVtN5Hg1kORoCKx3Urm7nASy9ugfJnkq14526d96auoNXZI20hxGIeVxfkM3AFUcRg/s1200/Coming%20soon%20...%20.jpg";

                    // ★ 画像サイズを変更：例 s400（幅400px）に
                    if (media) {
                        img = media.url.replace(/\/s\d{2,4}(-c)?\//, "/s400/");
                    }
                
                // カードHTMLを追加
                container.innerHTML += `
                    <li class="blogpost-card">
                        <article>
                            <a href="${link}">
                                <div class="topic-card-thumbnail-wrapper">
                                    <img class="topic-card-thumbnail-image" src="${img}" alt="${title}">
                                </div>
                                <h3 class="topic-card-post-title">${title}</h3>
                                <time datetime="${isoDate}" class="topic-card-post-datetime">${date}</time>
                                <p class="topic-card-post-body">
                                    ${summary}
                                </p>
                            </a>
                        </article>
                    </li>
                `;

                count++;
            }
        })

        .catch(function (error) {
            console.error("読み込みエラー:", error);
        });

    });

});




