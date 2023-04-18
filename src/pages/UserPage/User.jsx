import React, { useState, useEffect } from "react";
// import "./User.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import staticimages from "../staticImagesLink";
import { Link, useHistory, useParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { dark, error, success, warning, info } from "../../actions/alertAction";
import { profileloader } from "../../actions/profileLoaderAction";
import http from "../../services/httpCall";
import apis from "../../services/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Helmet } from "react-helmet";

// Change api end point in fetch details funtion.
function User({ dark, error, success, warning, info, profileloader }) {
  let history = useHistory();
  let [hidespan, sethidespan] = useState(false);
  let [showfullabout, setshowfullabout] = useState(false);
  let [userdetails, setuserdetails] = useState({});
  let [solved, setsolved] = useState([]);
  let [showscoremodal, setshowscoremodal] = useState(false);
  let { username } = useParams();

  let fetchUserDetails = async () => {
    try {
      profileloader(true);
      let response = await http.get(
        `${apis.GET_OTHER_USER_INFO}/${username.toLowerCase()}`
      );

      if (response.data.status === 200) {
        setsolved(response.data.data.problemsolved);
        setuserdetails(response.data.data);
        if (response.data.data.error && response.data.data.error.length > 0) {
          response.data.data.error.forEach((error_el) => {
            error(error_el);
          });
        }
      } else if (response.data.status === 409) {
        dark("profile not found");
        history.push("/networkerror");
      }
    } catch (err) {
      // console.log(err);
      if (!navigator.onLine) {
        history.push("/networkerror");
        dark("please connect to internet");
      } else {
        dark("so sorry, please try after sometime");
      }
    } finally {
      profileloader();
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(userdetails);
  }, [userdetails]);

  return (
    <>
      {showscoremodal && (
        <div className="scoreinfo-modal" id="scoreinfomodal">
          <div className="scoreinfo-modal-main">
            <div className="scoreinfo-modal-inner">
              <span
                className="scoreinfo-closebtn"
                onClick={() => {
                  setshowscoremodal(false);
                }}>
                &times;
              </span>
              <div className="scoreinfo-header">
                <h2>Well, what's your codec score?</h2>
                <hr />
              </div>
              <div className="scoreinfo-content">
                <p>
                  This place is all about your growth. Our Codec score is a very
                  comprehensive tool that lets you monitor your performance and
                  lets you track your growth. The backbone of this tool is a
                  very sophisticated algorithm that considers a bunch of
                  features related to every question you solve, how did you
                  solve it, and a lot of other factors. Guess what? This is not
                  the end, this tool will also help you by projecting where you
                  would stand if you keep going at the same rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="user-main-div">
        <Helmet>
          <title>{`${userdetails?.codecard_username} - CodeCard Profile`}</title>
          <meta name="title" property="og:title" content="CodeCard Profile" />
          <meta name="type" property="og:type" content="website" />
          <meta
            name="image"
            property="og:image"
            content={userdetails?.imageurl}
          />
          <meta
            name="url"
            property="og:url"
            content={`https://codecard.in/${userdetails.codecard_username}`}
          />
          <meta
            name="description"
            property="og:description"
            content={userdetails?.about}
          />
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <div className="container">
          {/* Main Content */}
          <div className="container-fluid main-content ">
            <div className="profile-main-content-inner">
              {/* Personal Info */}
              <div className="profile-info">
                <div className="profile-img">
                  {Object.keys(userdetails).length === 0 ? (
                    <SkeletonTheme
                      color="#bbb7b0"
                      highlightColor="rgb(194, 188, 174)">
                      <p style={{ margin: 0 }}>
                        <Skeleton circle={true} width={140} height={140} />
                      </p>
                    </SkeletonTheme>
                  ) : userdetails.imageurl === "" ? (
                    <img src={staticimages.UserAvatar} alt="username"></img>
                  ) : (
                    <img src={userdetails.imageurl} alt="username" />
                  )}
                </div>
                <div className="user-info">
                  <div className="username-div">
                    {Object.keys(userdetails).length === 0 ? (
                      <div className="username-div-skeleton">
                        <SkeletonTheme
                          color="#bbb7b0"
                          highlightColor="rgb(194, 188, 174)">
                          <p>
                            <Skeleton count={1} />
                          </p>
                        </SkeletonTheme>
                      </div>
                    ) : (
                      <>
                        <h4>
                          {userdetails && userdetails.firstname}{" "}
                          {userdetails && userdetails.lastname}
                        </h4>
                      </>
                    )}
                  </div>

                  <div className="collegename-div">
                    {Object.keys(userdetails).length === 0 ? (
                      <div className="collegename-div-skeleton">
                        <SkeletonTheme
                          color="#bbb7b0"
                          highlightColor="rgb(194, 188, 174)">
                          <p>
                            <Skeleton count={1} />
                          </p>
                        </SkeletonTheme>
                      </div>
                    ) : (
                      <>
                        <h6>
                          {userdetails &&
                          (userdetails.college === undefined ||
                            userdetails.college === "undefined" ||
                            userdetails.college === "")
                            ? "-"
                            : userdetails.college}
                        </h6>
                      </>
                    )}
                  </div>

                  <div className="share-profile">
                    <span>Share this profile:</span>
                    <LinkedinShareButton
                      url={`https://codecard.in/${userdetails?.codecard_username}`}
                      className="social-share-icon"
                      title={`${userdetails?.firstname} - CodeCard Profile`}>
                      <LinkedinIcon size={35} round={true} />
                    </LinkedinShareButton>
                    <TwitterShareButton
                      url={`https://codecard.in/${userdetails?.codecard_username}`}
                      className="social-share-icon"
                      title={`${userdetails?.firstname} - CodeCard Profile`}
                      hashtags={["codecard", "interview"]}>
                      <TwitterIcon size={35} round={true} />
                    </TwitterShareButton>
                    <RedditShareButton
                      url={`https://codecard.in/${userdetails?.codecard_username}`}
                      className="social-share-icon"
                      title={`${userdetails?.firstname} - CodeCard Profile`}>
                      <RedditIcon size={35} round={true} />
                    </RedditShareButton>
                    <WhatsappShareButton
                      url={`https://codecard.in/${userdetails?.codecard_username}`}
                      className="social-share-icon"
                      title={`${userdetails?.firstname} - CodeCard Profile`}>
                      <WhatsappIcon size={35} round={true} />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>

              {/* Profile Ratings */}
              <div className="ratings">
                <header>
                  <div className="rating-heading">
                    <h3>Progress Card</h3>
                  </div>
                </header>

                <div className="user-ratings">
                  <div className="user-ratings-header">
                    <span>Profile Link</span>
                    <span>Problems Solved</span>
                    <span>Ratings</span>
                  </div>

                  <div className="user-progress-content leetcode">
                    <Link
                      to={{
                        pathname: userdetails.leetcode_username
                          ? `https://leetcode.com/${userdetails.leetcode_username}/`
                          : "#",
                      }}
                      target="__blank"
                      className="image-wrapper">
                      <img src={staticimages.Leetcode} alt="leetcode rating" />
                    </Link>
                    <div className="problem-solved">
                      {userdetails.leetcode !== -1 &&
                      userdetails.leetcode !== -2
                        ? userdetails.leetcode
                        : "-"}
                    </div>
                    <div className="ratings-info">-</div>
                  </div>

                  <div className="user-progress-content geeksforgeeks">
                    <Link
                      to={{
                        pathname: userdetails.gfg_username
                          ? `https://auth.geeksforgeeks.org/user/${userdetails.gfg_username}/practice/`
                          : "#",
                      }}
                      target="__blank"
                      className="image-wrapper">
                      <img
                        src={staticimages.GeeksforGeeks}
                        alt="geeksforgeeks rating"
                      />
                    </Link>
                    <div className="problem-solved">
                      {userdetails.geeksforgeeks !== -1 &&
                      userdetails.geeksforgeeks !== -2
                        ? userdetails.geeksforgeeks
                        : "-"}
                    </div>
                    <div className="ratings-info">-</div>
                  </div>

                  <div className="user-progress-content codechef">
                    <Link
                      to={{
                        pathname: userdetails.codechef_username
                          ? `https://www.codechef.com/users/${userdetails.codechef_username}`
                          : "#",
                      }}
                      target="__blank"
                      className="image-wrapper">
                      <img src={staticimages.Codechef} alt="codechef rating" />
                    </Link>
                    <div className="problem-solved">-</div>
                    <div className="ratings-info">
                      {userdetails.codechef !== -1 &&
                      userdetails.codechef !== -2
                        ? userdetails.codechef
                        : "-"}
                    </div>
                  </div>

                  <div className="user-progress-content codeforces">
                    <Link
                      to={{
                        pathname: userdetails.codeforces_username
                          ? `https://codeforces.com/profile/${userdetails.codeforces_username}`
                          : "#",
                      }}
                      target="__blank"
                      className="image-wrapper">
                      <img
                        src={staticimages.Codeforces}
                        alt="codeforces rating"
                      />
                    </Link>
                    <div className="problem-solved">-</div>
                    <div className="ratings-info">
                      {userdetails.codeforces !== -1 &&
                      userdetails.codeforces !== -2
                        ? userdetails.codeforces
                        : "-"}
                    </div>
                  </div>

                  <div className="user-progress-content hackerearth">
                    <Link
                      to={{
                        pathname: userdetails.hackerearth_username
                          ? `https://www.hackerearth.com/@${userdetails.hackerearth_username}`
                          : "#",
                      }}
                      target="__blank"
                      className="image-wrapper">
                      <img
                        src={staticimages.Hackerearth}
                        alt="hackerearth rating"
                      />
                    </Link>
                    <div className="problem-solved">
                      {userdetails.hackerearth &&
                      userdetails.hackerearth !== -1 &&
                      userdetails.hackerearth !== -2
                        ? userdetails.hackerearth
                        : "-"}
                    </div>
                    <div className="ratings-info">-</div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className={`about ${showfullabout ? "a-tag-expand" : ""}`}>
                <header>
                  <div className="about-div">
                    <h3>About</h3>
                  </div>
                </header>
                {Object.keys(userdetails).length === 0 ? (
                  <SkeletonTheme
                    color="#bbb7b0"
                    highlightColor="rgb(194, 188, 174)">
                    <p>
                      <Skeleton count={3} />
                    </p>
                  </SkeletonTheme>
                ) : (
                  <p className="about-p">{userdetails.about}</p>
                )}

                {Object.keys(userdetails).length === 0 ? (
                  <SkeletonTheme
                    color="#bbb7b0"
                    highlightColor="rgb(194, 188, 174)">
                    <p>
                      <Skeleton count={1} />
                    </p>
                  </SkeletonTheme>
                ) : (
                  <span className={`about-span-tag ${hidespan ? "hide" : ""}`}>
                    ...
                    <Link
                      to="#"
                      className="about-a-tag"
                      onClick={() => {
                        sethidespan(true);
                        setshowfullabout(true);
                      }}>
                      see more
                    </Link>
                  </span>
                )}
              </div>

              {/* Problems Solved Section */}
              <div className="problemsolvedmain">
                <header>
                  <div className="problemsolvedinner">
                    <h3>
                      Problems Solved (<span>{solved && solved.length}</span>)
                    </h3>
                  </div>
                </header>

                <div className="solvedproblemslist">
                  {/* <ul>
                                    {solved  && solved.length!==0 && solved.map((problem,index)=>(
                                        <li key={index}><Link to={{pathname: (problem.link)}}>{problem.name}</Link></li>
                                    ))
                                    }
                                    </ul> */}
                  {solved && solved.length !== 0 ? (
                    <ul>
                      {solved.map((problem, index) => (
                        <li key={index}>
                          <Link to={{ pathname: problem.link }} target="_blank">
                            {problem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Hold on for a moment, this ship is yet to sail.</p>
                  )}
                </div>
              </div>

              {/* Overall Progress */}
              <div className="overall-progress">
                <div className="overall-contest-rating">
                  <h4
                    data-tip="React-tooltip"
                    data-for="score-info"
                    onClick={() => {
                      setshowscoremodal(true);
                    }}>
                    Codec Score
                  </h4>
                  <ReactTooltip
                    place="top"
                    id="score-info"
                    type="warning"
                    effect="solid">
                    <span>Click here to know more about it.</span>
                  </ReactTooltip>
                  <h5>
                    <FontAwesomeIcon
                      icon={`angle-${
                        userdetails && userdetails.last_perday_change > 0
                          ? "up"
                          : "down"
                      }`}
                    />
                    {Object.keys(userdetails).length === 0 ? (
                      <SkeletonTheme
                        color="#bbb7b0"
                        highlightColor="rgb(194, 188, 174)">
                        <p>
                          <Skeleton width={110} count={1} />
                        </p>
                      </SkeletonTheme>
                    ) : (
                      userdetails.overall_rating
                    )}
                  </h5>
                </div>
                <div
                  className={`per-day ${
                    userdetails && userdetails.last_perday_change < 0
                      ? "i-negative"
                      : ""
                  }`}>
                  <h4>Per Day Change</h4>
                  <h5>
                    <FontAwesomeIcon
                      icon={`angle-${
                        userdetails && userdetails.last_perday_change > 0
                          ? "up"
                          : "down"
                      }`}
                    />
                    {Object.keys(userdetails).length === 0 ? (
                      <SkeletonTheme
                        color="#bbb7b0"
                        highlightColor="rgb(194, 188, 174)">
                        <span>
                          <p style={{ margin: 0 }}>
                            <Skeleton width={110} count={1} />
                          </p>
                        </span>
                      </SkeletonTheme>
                    ) : (
                      <span>{userdetails.last_perday_change}</span>
                    )}
                    {/* <span>0.105</span> */}
                  </h5>
                </div>
                <div className="per-day-illustration-right">
                  <img src={staticimages.Skateboard} alt="skateboard" />
                </div>
                <div className="per-day-illustration-left">
                  <img src={staticimages.Happy} alt="happy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  Loader: state.Loader,
});

export default connect(mapStateToProps, {
  profileloader,
  dark,
  error,
  success,
  warning,
  info,
})(User);
