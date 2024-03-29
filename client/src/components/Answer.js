import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Tooltip,
  OverlayTrigger,
  Card,
  FormControl,
  Button as Button2,
} from "react-bootstrap";
import Moment from "react-moment";
import Avatar from "react-avatar";
import { Button } from "@blueprintjs/core";
import { Position, Toaster, Intent } from "@blueprintjs/core";
import { Link, NavLink } from "react-router-dom";
import { FONTS } from "../constants";

import { AuthContext } from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Answer = (props) => {
  let handlecomment = props.showcomment
  let forum = props.data;
  let isAuthenticated = props.isAuthenticated;

  // Initial User Profile
  const auth = useContext(AuthContext);

  var { token } = auth?.authState;
  var decoded;
  var user;

  if (isAuthenticated) {
    decoded = jwt_decode(token);
    user = decoded;
  }

  const [isShowCommentForm, setIsShowCommentForm] = useState(false);
  const [toaster, setToaster] = useState([]);

  function addToast(msg) {
    toaster.show({ message: `${msg}`, intent: Intent.WARNING, icon: "edit" });
  }

  // * Sub-Component | Comment
  const CommentList = (props) => {
    let commentList = props.commentList;

    return (
      <>
        {commentList.lenght === 0 ? <div>no any</div> : null}
        {commentList.lenght !== 0
          ? commentList.map((c) => {
              return <CommentCard commentID={c} />;
            })
          : null}
      </>
    );
  };

  const CommentCard = (props) => {
    let commentID = props.commentID;
    const [commentData, setCommentData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isCommentCardLoading, setIsCommentCardLoading] = useState(false);

    useEffect(() => {
      // ? Request GET | Comment
      fetch(`http://localhost:5000/comments/${commentID}`)
        .then((res) => res.json())
        .then((res) => {
          setCommentData(res);
          console.log("Comment : ", res);

          // ? Request GET | user
          fetch(`http://localhost:5000/users/${res.userID}`)
            .then((res) => res.json())
            .then((res) => {
              setUserData(res);
              console.log("User : ", res);
              setIsCommentCardLoading(true);
            });
        });
    }, []);

    return isCommentCardLoading ? (
      <div className="commentlist-content">
        <HeaderUserComment comment={commentData} user={userData} />

        <div className="commentlist-content-text" style={FONTS.h4}>
          {commentData.commentText}
        </div>
      </div>
    ) : null;
  };

  const handleClickCommentForm = () => {
    setIsShowCommentForm(!isShowCommentForm);
  };

  const CommentForm = (props) => {
    let answer = props.answer;

    const [commentText, setCommentText] = useState("");

    const onChangeAddComment = (e) => {
      setCommentText(e.target.value);
    };

    const handleAddComment = () => {
      let _data = {
        userID: user?.userID,
        answerID: answer.answerID,
        commentText: commentText,
      };

      // Clear
      setCommentText("");
      // ? Request Create Answer
      fetch(`http://localhost:5000/comments`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_data),
      })
        .then((response) => response.json())
        .then((data) => {

          // Add list comment in Answer
          answer.listComment.push(`${data.commentID}`);
          let __data = {
            answerID: answer.answerID,
            listComment: answer.listComment,
          };

          // ? Request Update List Comment of Answer
          fetch(`http://localhost:5000/answers/${answer.answerID}`, {
            method: "PUT", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(__data),
          })
            .then((response) => response.json())
            .then((data) => {
              //   console.log("Answer Success:", data);
            })
            .catch((error) => {
              //   console.error("Answer Error:", error);
            });
        })
        .catch((error) => {
          //   console.error("Comment Error:", error);
        });
    };

    const validatecommentText = () => {
      if (commentText === "") {
        addToast("โปรดกรอก ข้อความ ก่อน");
      }
      if (commentText !== "") {
        handleAddComment();
        handlecomment();
      }
    };

    return (
      <div style={{ display: "flex" }} className="ps-3">
        <FormControl
          as="textarea"
          onChange={onChangeAddComment}
          placeholder="Add a comment..."
          className="input-answer"
          value={commentText}
        />
        <Button2
          variant="primary"
          className="btn-answer bs-2"
          onClick={validatecommentText}
        >
          Reply
        </Button2>
      </div>
    );
  };

  const HeaderUserComment = (props) => {
    let user = props.user;
    let comment = props.comment;

    return (
      <div className="header">
        <div className="options">
          <i className="fa fa-chevron-down"></i>
        </div>

        <Link to={`/profile/${user.userID}`} className="me-1">
          {user.imgURL ? (
            <Avatar size="35" src={user.imgURL.indexOf("http") === 0 ? user.imgURL : "http://localhost:5000/"+user.imgURL} round={true} />
          ) : (
            <Avatar
              size="35"
              name={user.firstName + " " + user.lastName}
              round={true}
            />
          )}
        </Link>

        <div>
          <div className="co-name">
            <Link to={`/profile/${user.userID}`} style={FONTS.name}>
              {user.firstName ? user.firstName + " " + user.lastName : ""}
            </Link>
          </div>
          <div className="time noselect">
            <Moment
              element="span"
              data={comment.createdAt}
              locale="th"
              format="DD/MM/YYYY"
            />{" "}
            ·{" "}
            <Moment fromNow locale="th">
              {comment.createdAt}
            </Moment>
          </div>
        </div>

        <div className="btn-more"></div>
      </div>
    );
  };

  // * Sub-Component | Answer
  const AnswerForm = () => {
    const [answerText, setAnswerText] = useState("");

    const onChangeAddAnswer = (e) => {
      setAnswerText(e.target.value);
    };

    const handleAddAnswer = () => {
      let _data = {
        userID: user?.userID,
        answerText: answerText,
      };

      // Clear
      setAnswerText("");
      // ? Request Create Answer
      fetch(`http://localhost:5000/answers`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add list answer in forum
          forum.listAnswer.push(`${data.answerID}`);
          let __data = {
            forumID: forum.forumID,
            listAnswer: forum.listAnswer,
          };
          // ? Request Update ListAnswer of Forum
          fetch(`http://localhost:5000/forums/${forum.forumID}`, {
            method: "PUT", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(__data),
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log("Forum Success:", data);
            })
            .catch((error) => {
              // console.error("Forum Error:", error);
            });
        })
        .catch((error) => {
          // console.error("Answer Error:", error);
        });
    };

    const validateAnswerText = () => {
      
      if (answerText === "") {
        addToast("โปรดกรอก ข้อความ ก่อน");

      }
      if (answerText !== "") {
        handleAddAnswer();
        handlecomment();
      }
    };

    if (isAuthenticated) {
      return (
        <div>
          <div className="answer-box ">
            <NavLink to={`/profile/${user.userID}`} className="me-3">
              {user?.imgURL ? (
                <Avatar size="35" src={user.imgURL.indexOf("http")===0 ? user.imgURL : "http://localhost:5000/"+user.imgURL} round={true} />
              ) : (
                <Avatar
                  size="35"
                  name={user.firstName + " " + user.lastName}
                  round={true}
                />
              )}
            </NavLink>
            <FormControl
              as="textarea"
              onChange={onChangeAddAnswer}
              placeholder="Add a answer..."
              className="input-answer"
              value={answerText}
            />
            <Button2
              variant="primary"
              className="btn-answer"
              style={FONTS.h4}
              onClick={validateAnswerText}
            >
              Add answer
            </Button2>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const AnswerList = (props) => {
    // let isBestAnswer = true;
    let isAuthenticated = props.isAuthenticated;

    const [answerList, setAnswerList] = useState([]);

    useEffect(() => {
      fetch(`http://localhost:5000/forums/${forum.forumID}`)
        .then((res) => res.json())
        .then((res) => {
          setAnswerList(res.listAnswer.reverse());
          console.log("refresh");
        });
    }, []);

    return (
      <>
        {answerList.map((ans) => (
          <AnswerCard answerID={ans} isAuthenticated={isAuthenticated} />
        ))}
      </>
    );
  };

  const AnswerCard = (props) => {
    let answerID = props.answerID;

    const [amountComment, setAmountComment] = useState(0);
    const [amountLike, setAmountLike] = useState(0);

    let isAuthenticated = props.isAuthenticated;

    const [answerData, setAnswerData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isEachAnsCardLoading, setIsEachAnsCardLoading] = useState(false);
    const [commentList, setCommentList] = useState(null);
    const [isYouLike, setIsYouLike] = useState(null);

    useEffect(() => {
      // ? Request GET | Answer
      fetch(`http://localhost:5000/answers/${answerID}`)
        .then((res) => res.json())
        .then((res) => {
          setAnswerData(res);
          setAmountLike(res.whoVoteLike.length);
          setIsYouLike(
            isAuthenticated
              ? res.whoVoteLike.indexOf(user.userID) === -1
                ? false
                : true
              : false
          );
          setCommentList(res.listComment);
          setAmountComment(res.listComment.length);
          // console.log("Comment : ", res);
          // ? Request GET | user
          fetch(`http://localhost:5000/users/${res.userID}`)
            .then((res) => res.json())
            .then((res) => {
              setUserData(res);
              //   console.log("User : ", res);
              setIsEachAnsCardLoading(true);
            });
        });
    }, []);

    const handleVote = () => {
      let whoVoteLike = answerData.whoVoteLike;

      if (isAuthenticated) {
        let index = whoVoteLike.indexOf(user.userID);
        if (index === -1) {
          setIsYouLike(true);
          whoVoteLike.push(user.userID);
          setAmountLike(amountLike + 1);
          let update = {
            answerID: answerData.answerID,
            whoVoteLike: whoVoteLike,
          };
          axios.put(`http://localhost:5000/answers/${answerData.answerID}`, update);
        } else {
          setIsYouLike(false);
          let update = {
            answerID: answerData.answerID,
            whoVoteLike: whoVoteLike,
          };
          whoVoteLike.splice(index, 1);
          setAmountLike(amountLike - 1);
          axios.put(`http://localhost:5000/answers/${answerData.answerID}`, update);
        }
      } else {
        addToast("โปรด Login ก่อน");
      }
    };

    const UpvoteBotton = (props) => {
      return (
        <OverlayTrigger
          key={"top"}
          placement={"top"}
          overlay={<Tooltip id={`tooltip-${"top"}`}>Upvote</Tooltip>}
        >
          <Button
            className="bp3-minimal comment2"
            icon="thumbs-up"
            style={FONTS.body4}
            onClick={handleVote}
            intent={isYouLike ? Intent.PRIMARY : Intent.NONE}
          >
            {amountLike}
          </Button>
        </OverlayTrigger>
      );
    };

    const ReplyBotton = () => {
      return (
        <OverlayTrigger
          key={"top"}
          placement={"top"}
          overlay={<Tooltip id={`tooltip-${"top"}`}>Reply</Tooltip>}
        >
          <Button
            className="bp3-minimal comment2 ms-2"
            icon="chat"
            style={{ marginLeft: 5 }}
            onClick={handleClickCommentForm}
            style={FONTS.body4}
          >
            {amountComment}
          </Button>
        </OverlayTrigger>
      );
    };

    return (
      <>
        {isEachAnsCardLoading ? (
          <Card className="answerlist-card">
            <div>
              <HeaderUserAnswer answer={answerData} user={userData} />
              <div className="answerlist-content">
                <div className="answerlist-content-text">
                  {answerData.answerText}
                </div>

                <UpvoteBotton />
                <ReplyBotton />

                {isShowCommentForm && isAuthenticated ? (
                  <CommentForm answer={answerData} />
                ) : null}
              </div>
            </div>

            {/* // ! Comment */}
            {commentList ? (
              <>
                <CommentList commentList={commentList} />
              </>
            ) : (
              <></>
            )}
          </Card>
        ) : null}
      </>
    );
  };

  const HeaderUserAnswer = (props) => {
    let user = props.user;
    let answer = props.answer;

    return (
      <div className="header">
        <div className="options">
          <i className="fa fa-chevron-down"></i>
        </div>
        <Link to={`/profile/${user.userID}`} className="me-1">
          {user.imgURL ? (
            <Avatar size="35" src={user.imgURL.indexOf("http") === 0 ? user.imgURL : "http://localhost:5000/"+user.imgURL} round={true} />
          ) : (
            <Avatar
              size="35"
              name={user.firstName + " " + user.lastName}
              round={true}
            />
          )}
        </Link>
        <div>
          <div className="co-name">
            <Link to={`/profile/${user.userID}`} style={FONTS.name}>
              {user.firstName ? user.firstName + " " + user.lastName : ""}
            </Link>
          </div>
          <div className="time noselect" style={FONTS.time}>
            <div>
              <Moment
                element="span"
                data={answer.createdAt}
                locale="th"
                format="DD/MM/YYYY"
              />{" "}
              ·{" "}
              <Moment fromNow locale="th">
                {answer.createdAt}
              </Moment>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ! Answer Component
  return (
    <div className="answer-pad">
      <AnswerForm user={user} />
      <AnswerList isAuthenticated={isAuthenticated} />
      <Toaster position={Position.TOP} ref={(ref) => setToaster(ref)} />
    </div>
  );
};

export default Answer;
