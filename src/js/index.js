const menuBarBtn = document.querySelector(".menubar__btn");
const sideDrawer = document.querySelector(".sidedrawer");
const shorteningIputField = document.querySelector(".shortening__input-field");
const shortenedLinksContainerEl = document.querySelector(
    ".generated__link--list"
);
const shortenLinkBtn = document.querySelector(".shorten__link-btn");
const shorteningForm = document.querySelector(".shortening-form");
const formErrorMessageEl = document.querySelector(".error-message");

const shortenedLinks = [];

const toggleSideDrawer = () => {
    sideDrawer.classList.toggle("open");
};

const getShorteningInputValue = () => shorteningIputField.value;

const generateNewLinkList = (title, shortLink) => {
    return `<li class="generated__link">
            <p
                class="
                    paragraph paragraph--lg paragraph--black
                    generated__link--title"
            >
                ${title}
            </p>
            <p class="paragraph paragraph--lg paragraph--cyan generated__link--val">${shortLink}</p>
            <button class="btn btn--sm btn--sm-padded btn--primary btn--copy">
                Copy
            </button>
        </li>`;
};

const updateShortendLinkList = () => {
    const shortenedLinksMarkupArr = shortenedLinks.map((el) =>
        generateNewLinkList(el.originalURL, el.shortenedURL)
    );
    shortenedLinksContainerEl.innerHTML = shortenedLinksMarkupArr.join("");
};

const shortenLinkHandler = async () => {
    const linkToShorten = getShorteningInputValue();
    if (linkToShorten.trim() === "") {
        formErrorMessageEl.innerText = "Please add a link";
        shorteningForm.classList.add("empty");
        return;
    } else {
        shorteningForm.classList.remove("empty");
    }

    shortenLinkBtn.classList.add("btn--loading");
    await fetch(`https://api.shrtco.de/v2/shorten?url=${linkToShorten}`)
        .then((res) => res.json())
        .then((res) => {
            if (!res.ok) throw new Error(res.error);
            shorteningForm.classList.remove("error");
            shorteningForm.classList.add("success");
            setTimeout(() => shorteningForm.classList.remove("success"), 3000);
            formErrorMessageEl.innerText = "Link generated successfully!";
            const newShortenedLinkObj = {
                originalURL: res.result.original_link,
                shortenedURL: res.result.short_link,
            };
            shortenedLinks.push(newShortenedLinkObj);
            shortenLinkBtn.classList.remove("btn--loading");
            updateShortendLinkList();
            shorteningIputField.value = "";
        })
        .catch((err) => {
            formErrorMessageEl.innerText = err.message;
            shorteningForm.classList.remove("success");
            shorteningForm.classList.add("error");
            shortenLinkBtn.classList.remove("btn--loading");
        });
};

const copyToClipboard = (event) => {
    if (!event.target.classList.contains("btn")) return;

    const linkValue = event.target.previousElementSibling.innerText;

    shortenedLinksContainerEl.querySelectorAll(".btn").forEach((el) => {
        el.classList.remove("btn--secondary");
        el.innerText = "Copy";
        el.classList.add("btn--primary");
    });

    navigator.clipboard.writeText(linkValue).then(
        () => {
            event.target.classList.remove("btn--primary");
            event.target.classList.add("btn--secondary");
            event.target.innerText = "Copied!";
        },
        () => alert("Something went wrong during copying!")
    );
};

menuBarBtn.addEventListener("click", toggleSideDrawer);
shortenLinkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("btn--loading")) return;
    shortenLinkHandler();
});

shortenedLinksContainerEl.addEventListener("click", copyToClipboard);
