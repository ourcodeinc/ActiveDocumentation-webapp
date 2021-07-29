import React, {Component} from "react";
import {groupTitle} from "../../miningRulesCore/featureConfig";
import {Col, Row} from "react-bootstrap";
import MinedRulePad from "./minedRulePad";


class MinedDesignRules extends Component {
    constructor(props) {
        // required props: featureMetaData
        super(props);
        this.state = {};
        this.state.minedRules = props.minedRules;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({minedRules: nextProps.minedRules});
    }

    render() {
        if (this.state.minedRules.length === 0)  return null;
        console.log({"mined Rules": this.state.minedRules, "feature MetaData": this.props.featureMetaData});
        return this.state.minedRules.map((group, i) => {
            return (
                <div key={i}>
                    <h4>{groupTitle[group.group] ? groupTitle[group.group] : group.group}</h4>
                    {group.rules.map((rule, j) => {
                        return (
                            <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"} key={j}>
                                <Row>
                                    <Col md={7}>
                                        <MinedRulePad key={new Date()} rulePadState={rule.rulePadState}/>
                                    </Col>
                                    <Col md={5}>
                                        <h5><strong>
                                            Rule with {rule.featureIds.length} Attributes
                                        </strong></h5>
                                        <h5>{rule.grammar}</h5>
                                        <h5><strong>Support {rule.support}</strong></h5>
                                        <h5><strong>Utility {rule.utility}</strong></h5>
                                        <br/>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                    }
                </div>
            )
        })
    }
}

export default MinedDesignRules;