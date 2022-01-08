import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Embed from "flat-embed";

const FlatEditor = (props) => {
  const [json, setJson] = useState("");
  const editorRef = React.createRef();
  let embed;
  const refreshJSON = () => {
    embed.getJSON().then((jsonData) => setJson(JSON.stringify(jsonData)));
  };
  useEffect(() => {
    embed = new Embed(editorRef.current, {
      score: "617052dca7f3100012392bb6",
      height: "450",
      embedParams: {
        mode: "edit",
        sharingKey:
          "6e24af728f6029fcc69f05aa95f3e0fd6b87c613b54b39b1ae0f123cc698c5d69633c7625ef194f2bd0f6f73cc923a4716bad2283642bd0cad0f4335e6777410",
        appId: "60a51c906bcde01fc75a3ad0",
        controlsPosition: "bottom",
      },
    });
  }, []);

  return (
    <Row>
      <Col>
        <div ref={editorRef}></div>
      </Col>
      <Col style={{ maxWidth: "40%", whiteSpace: "pre-wrap" }}>
        <Button onClick={refreshJSON}>Refresh JSON</Button>
        <pre style={{ whiteSpace: "pre-wrap" }}>{json}</pre>
      </Col>
    </Row>
  );
};

export default FlatEditor;
