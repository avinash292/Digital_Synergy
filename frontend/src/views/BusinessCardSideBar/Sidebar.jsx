import {
  ListItem,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import PublicIcon from "@material-ui/icons/Public";
import LinkIcon from "@material-ui/icons/Link";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import TelegramIcon from "@material-ui/icons/Telegram";
import GitHubIcon from "@material-ui/icons/GitHub";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PaymentIcon from "@material-ui/icons/Payment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "./SidebarStyle";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Sidebar = (props) => {
  const classes = useStyles();
  const inputRef = useRef(null);
  const { id } = useParams();
  const [input, setInput] = useState(null);
  useEffect(() => {
    if (id) {
      // const cardData = localStorage.getItem("card_data");
      // console.log("cardData : " + JSON.parse(cardData).cardName);
      // const cardName = JSON.parse(cardData).cardName;
      // if (cardName) {
      //   setInput(cardName);
      //   inputRef.current.focus();
      // }
    }
  }, [id]);
  // Function to handle theme color change
  const handleThemeChange = (themeColor) => {
    props.handleThemeChange(themeColor);
  };

  const handleLogoImageUpload = (event) => {
    props.handleLogoImageUpload(event);
  };

  const handleCoverImageUpload = (event) => {
    props.handleCoverImageUpload(event);
  };

  const handleProfileImageUpload = (event) => {
    props.handleProfileImageUpload(event);
  };

  const handleChangeLayout = (layout) => {
    props.handleChangeLayout(layout);
  };

  const handleChangeinput = (e) => {
    setInput(e.target.value);
    props.handleChangeinput(e);
  };

  return (
    <div className={classes.root}>
      <div className={classes.cardContainer}>
        <Grid item xs={12} className={classes.cardData}>
          <ListItem className={classes.listItem}>
            <TextField
              label="Card Name"
              value={input}
              onChange={(e) => {
                handleChangeinput(e);
              }}
              fullWidth
              style={{ marginBottom: "16px" }}
              inputRef={inputRef}
              disabled={id}
            />
          </ListItem>
        </Grid>
        <div className={`${classes.cardData} ${classes.gapData}`}>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Change Layout</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  onClick={() => handleChangeLayout(1)}
                  className={classes.layout}
                >
                  <img
                    src="/images/layout/layout1.png"
                    alt="layout1.png"
                    className={classes.layoutImg}
                  />
                  Layout 1
                </div>
                <div
                  onClick={() => handleChangeLayout(2)}
                  className={classes.layout}
                >
                  <img
                    src="/images/layout/layout2.png"
                    alt="layout2.png"
                    className={classes.layoutImg}
                  />
                  Layout 2
                </div>
                <div
                  onClick={() => handleChangeLayout(3)}
                  className={classes.layout}
                >
                  <img
                    src="/images/layout/layout3.png"
                    alt="layout3.png"
                    className={classes.layoutImg}
                  />
                  Layout 3
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className={classes.flexData}>
            <div>
              <span>Add Image</span>
            </div>
          </div>
          <div className={classes.flexData}>
            <label htmlFor="profile-upload" className={classes.chooseButton}>
              Add Profile
            </label>
            <input
              type="file"
              id="profile-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleProfileImageUpload} // Define handleProfileImageUpload function
            />

            <label htmlFor="logo-upload" className={classes.chooseButton}>
              Add Logo
            </label>
            <input
              type="file"
              id="logo-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleLogoImageUpload} // Define handleLogoImageUpload function
            />

            <label htmlFor="cover-upload" className={classes.chooseButton}>
              Add Cover
            </label>
            <input
              type="file"
              id="cover-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleCoverImageUpload} // Define handleCoverImageUpload function
            />
          </div>
        </div>

        <div className={classes.cardData}>
          <div>Choose Theme</div>
          <div className={classes.gapData}>
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#b8acab" }}
              onClick={() => handleThemeChange("#b8acab")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#78706f" }}
              onClick={() => handleThemeChange("#78706f")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#b1d9a7" }}
              onClick={() => handleThemeChange("#b1d9a7")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#e2e8e1" }}
              onClick={() => handleThemeChange("#e2e8e1")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#bd90d4" }}
              onClick={() => handleThemeChange("#bd90d4")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#d676ce" }}
              onClick={() => handleThemeChange("#d676ce")}
            />

            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#076122" }}
              onClick={() => handleThemeChange("#076122")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#662a34" }}
              onClick={() => handleThemeChange("#662a34")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#f04030" }}
              onClick={() => handleThemeChange("#f04030")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#8f9117" }}
              onClick={() => handleThemeChange("#8f9117")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#54544d" }}
              onClick={() => handleThemeChange("#54544d")}
            />
            <button
              className={classes.chooseTheme}
              style={{ backgroundColor: "#4dcdd1" }}
              onClick={() => handleThemeChange("#4dcdd1")}
            />
          </div>
        </div>

        <div className={`${classes.cardData} ${classes.gapData}`}>
          <div>
            <h3>Add Your Details</h3>
          </div>
          {Object.entries({
            Person: [
              {
                title: "Name",
                src: <AccountCircleIcon />,
                icon: "<AccountCircleIcon />",
                fields: [{ key: "name", value: "", label: "Name" }],
              },
              {
                title: "Job Title",
                src: <WorkIcon />,
                icon: "<WorkIcon />",
                fields: [{ key: "jobTitle", value: "", label: "Job Title" }],
              },
              {
                title: "Department",
                src: <BusinessIcon />,
                icon: "<BusinessIcon />",
                fields: [{ key: "department", value: "", label: "Department" }],
              },
              {
                title: "Company Name",
                src: <BusinessIcon />,
                icon: "<BusinessIcon />",
                fields: [
                  { key: "company Name", value: "", label: "Company Name" },
                ],
              },
            ],
            General: [
              {
                title: "Email",
                src: <EmailIcon />,
                icon: "<EmailIcon />",
                fields: [{ key: "Email", value: "", label: "Email" }],
              },
              {
                title: "Phone",
                src: <PhoneIcon />,
                icon: "<PhoneIcon />",
                fields: [{ key: "phone", value: "", label: "Phone" }],
              },
              {
                title: "Coumpany URL",
                src: <PublicIcon />,
                icon: "<PublicIcon />",
                fields: [
                  { key: "company Url", value: "", label: "Company URL" },
                ],
              },
              {
                title: "Link",
                src: <LinkIcon />,
                icon: "<LinkIcon />",
                fields: [{ key: "link", value: "", label: "link" }],
              },
              {
                title: "Address",
                src: <LocationOnIcon />,
                icon: "<LocationOnIcon />",
                fields: [{ key: "address", value: "", label: "address" }],
              },
            ],
            Social: [
              {
                title: "Instagram",
                src: <InstagramIcon />,
                icon: "<InstagramIcon />",
                fields: [{ key: "instagram", value: "", label: "Instagram" }],
              },
              {
                title: "Threads",
                src: <PhoneIcon />,
                icon: "<PhoneIcon />",
                fields: [{ key: "threads", value: "", label: "Threads" }],
              },
              {
                title: "LinkedIn",
                src: <LinkedInIcon />,
                icon: "<LinkedInIcon />",
                fields: [{ key: "linkedIn", value: "", label: "LinkedIn" }],
              },
              {
                title: "Facebook",
                src: <FacebookIcon />,
                icon: "<FacebookIcon />",
                fields: [{ key: "Facebook", value: "", label: "Facebook" }],
              },
              {
                title: "Youtube",
                src: <YouTubeIcon />,
                icon: " <YouTubeIcon />",
                fields: [{ key: "Youtube", value: "", label: "Youtube" }],
              },
              {
                title: "Snapchat",
                src: <LinkIcon />,
                icon: "<LinkIcon />",
                fields: [{ key: "Snapchat", value: "", label: "Snapchat" }],
              },
              {
                title: "TikTok",
                src: <LocationOnIcon />,
                icon: "<LocationOnIcon />",
                fields: [{ key: "TikTok", value: "", label: "TikTok" }],
              },
            ],
            Messaging: [
              {
                title: "Whats App",
                src: <WhatsAppIcon />,
                icon: "<WhatsAppIcon />",
                fields: [{ key: "whatsApp", value: "", label: "whatsApp" }],
              },
              {
                title: "Signal",
                src: <PhoneIcon />,
                icon: "<PhoneIcon />",
                fields: [{ key: "signal", value: "", label: "Signal" }],
              },
              {
                title: "Skyp",
                src: <PublicIcon />,
                icon: "<PublicIcon />",
                fields: [{ key: "Skyp", value: "", label: "Skyp" }],
              },
              {
                title: "Telegram",
                src: <TelegramIcon />,
                icon: "<TelegramIcon />",
                fields: [{ key: "Telegram", value: "", label: "Telegram" }],
              },
            ],
            Business: [
              {
                title: "GitHub",
                src: <GitHubIcon />,
                icon: "<GitHubIcon />",
                fields: [{ key: "GitHub", value: "", label: "GitHub" }],
              },
            ],
            Payment: [
              {
                title: "PayPal",
                src: <PaymentIcon />,
                icon: "<PaymentIcon />",
                fields: [{ key: "PayPal", value: "", label: "PayPal" }],
              },
              {
                title: "Cash App",
                src: <AttachMoneyIcon />,
                icon: "<AttachMoneyIcon />",
                fields: [{ key: "cashApp", value: "", label: "cashApp" }],
              },
            ],
          }).map(([key, data]) => (
            <div key={key}>
              <hr />
              <h4>{key}</h4>
              <div
                className={`${classes.gapData}`}
                style={{ padding: "10px", cursor: "pointer" }}
              >
                {data.map((item) => (
                  <div
                    className={`${classes.gapData} ${classes.flexColumn}`}
                    key={`${key}${item.title}`}
                    onClick={() => props.handleModal(item)}
                  >
                    {item.src}
                    <div>{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
