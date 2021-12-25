import { styleModule } from "https://unpkg.com/style-module?module";

const headerStyles = styleModule({
  header: {
    display: "flex",
    alignItems: "center",
    height: "168px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    height: "108px",
    padding: "0 32px",
  },
  menuItem: {
    marginRight: "32px",
  },
  textItem: {
    fontSize: "14px",
  },
  specialItem: {
    fontSize: "14px",
    background: "linear-gradient(90deg, #dc3545, #ffc107);",
    borderRadius: "25px",
  },
  fontIcon: {
    opacity: "0.6",
  },
  cityName: {
    opacity: "0.6",
    paddingLeft: "3px",
  },
  authMenu: {
    display: "flex",
    alignItems: "flex-end",
  },
  confirmLink: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  userAuth: {
    fontSize: "25px",
    marginBottom: "4px",
  },
  authLink: {
    fontSize: "16px",
  },
});

const header = document.getElementById("header");
const headerContent = document.getElementById("headerContent");
const menuItems = header.querySelectorAll("#menuItem");
const textItems = header.querySelectorAll("#textItem");
const specialItem = document.getElementById("specialItem");
const fontIcons = header.querySelectorAll("fontIcons");
const cityName = document.getElementById("cityName");
const authMenu = document.getElementById("authMenu");
const confirmLinks = header.querySelectorAll("#confirmLink");
const usersAuth = header.querySelectorAll("#userAuth");
const authLinks = header.querySelectorAll("#authLink");

document.addEventListener("DOMContentLoaded", () => {
  headerStylish(
    headerStyles,
    header,
    headerContent,
    menuItems,
    textItems,
    specialItem,
    fontIcons,
    cityName,
    authMenu,
    confirmLinks,
    usersAuth,
    authLinks
  );
});

function headerStylish(headerStyles, ...headerSelectors) {
  const {
    header,
    headerContent,
    menuItem,
    textItem,
    specialItem,
    fontIcon,
    cityName,
    authMenu,
    confirmLink,
    userAuth,
    authLink,
  } = headerStyles;

  headerSelectors[0].classList.add(header);
  headerSelectors[1].classList.add(headerContent);
  headerSelectors[4].classList.add(specialItem);
  headerSelectors[6].classList.add(cityName);
  headerSelectors[7].classList.add(authMenu);

  headerSelectors[2].forEach((item) => {
    item.classList.add(menuItem);
  });
  headerSelectors[3].forEach((item) => {
    item.classList.add(textItem);
  });
  headerSelectors[5].forEach((icon) => {
    icon.classList.add(fontIcon);
  });
  headerSelectors[8].forEach((link) => {
    link.classList.add(confirmLink);
  });
  headerSelectors[9].forEach((user) => {
    user.classList.add(userAuth);
  });
  headerSelectors[10].forEach((link) => {
    link.classList.add(authLink);
  });
}
