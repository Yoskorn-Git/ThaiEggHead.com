import "../App.css";
import { images, FONTS } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Row,
    Col,
    Form,
    Container,
    Button,
    Card,
    Badge,
    NavLink
} from "react-bootstrap";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SearchForum({ isAuthenticated }) {
    let { keyword } = useParams();
    const [datas, setDatas] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");
    const forums = datas
    const loc = useLocation();
    let history = useHistory();

    useEffect(() => {
        fetch("http://localhost:5000/forums")
            .then((res) => res.json())
            .then((res) => {
                setDatas(res);
                setSearchQuery(keyword)
            })
    }, [loc]);

    const filterPosts = (forums, query) => {
        if (!query) {
            return forums;
        }

        return forums.filter((forums) => {
            const postName = forums.title.toLowerCase();
            return postName.includes(query);
        });
    };

    const filteredPosts = filterPosts(forums, searchQuery);
    console.log(filteredPosts);

    const CardSearchResult = (props) => {
        return (
            <Card className="app-padding card-search-result">
                <Link to={`/question/${props.data.forumID}`}>
                    <Card.Subtitle style={{ fontFamily: "Krub-Regular", fontSize: 14, color: "black" }}>
                        {" " + props.data.title}
                    </Card.Subtitle>
                </Link>
                <div style={{ display: "flex" }}>
                    <ListSubjectTag data={props.data} />
                    <ListTag data={props.data} />
                </div>
            </Card>
        )
    }

    const ListSubjectTag = (props) => {
        const list = props.data.listSubject;
        const subjectTag = list.map((subject) => (
            <Badge key={subject} bg="warning" style={{ marginLeft: 4 }}>
                {subject}
            </Badge>
        ));
        return <div className="tag" style={FONTS.tag}>{subjectTag}</div>;
    };

    const ListTag = (props) => {
        const _list = props.data.listTag;
        const subjectTag = _list.map(
            (subject) => {
                return (
                    <Badge bg="info" style={{ marginLeft: 4 }}>
                        {subject}
                    </Badge>
                );
            }
        );
        return <div className="tag">{subjectTag}</div>;
    };

    const CurrentSearch = () => {
        return (
            <div className="header-seach">
                <div style={{ fontFamily: "Krub-Regular", fontSize: 30, fontWeight: "bold" }}>
                    ผลการค้นหา
                </div>
                <div style={{ fontFamily: "Krub-Regular", fontSize: 14 }}>ผลการค้นหาสำหรับ : {keyword}</div>
                <div style={{ fontFamily: "Krub-Regular", fontSize: 14 }}>{filteredPosts.length} ฟอรัม</div>
            </div>
        )
    }

    const handleKeyPress = (event) => {
        history.push(`/create/forum`);
    }

    if (datas) {
        if (filteredPosts.length===0)
            return (
                <div>
                    <Container fluid="xl">
                        <Row className="justify-content-md-center">

                            <Col md={6}>
                                <CurrentSearch />
                                <div className="bp3-non-ideal-state" style={FONTS.filter}>
                                    <div className="bp3-non-ideal-state-visual">
                                        <span className="bp3-icon bp3-icon-folder-open"></span>
                                    </div>
                                    <h4 className="bp3-heading" style={{ fontFamily: "Krub-Regular", fontSize: 22 }}>ไม่มีคำถามที่คุณกำลังตามหา</h4>
                                    <div style={{ fontFamily: "Krub-Regular", fontSize: 16 }}>สร้างคำถามเองเลยสิ</div>
                                    <NavLink to="/create/forum" style={{ fontFamily: "Krub-Regular", fontSize: 12 }}>
                                        <Button
                                            variant="warning"
                                            onClick={handleKeyPress}
                                        >
                                            ตั้งคำถาม
                                </Button>
                                    </NavLink>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        else
            return (
                <div>
                    <Container fluid="xl">
                        <Row className="justify-content-md-center">

                            <Col md={6}>
                                <CurrentSearch />
                                <div className="search-result">
                                    <ul>
                                        {filteredPosts.map(forums => (
                                            <CardSearchResult data={forums} />
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
    }

    else {
        return (<div>Loading...</div>)
    }
}
export default SearchForum;
