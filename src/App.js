import React, { Component } from "react";

import NavigationBar from "./component/NavigationBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import FreezeMoneyContainer from "./component/container/FreezeMoneyContainer/FreezeMoneyContainer.js";
import FreezeContractContainer from "./component/container/FreezeContractContainer/FreezeContractContainer.js";
import MessageContainer from "./component/container/MessageContainer/MessageContainer.js";
import InfoContainer from "./component/container/InfoContainer/InfoContainer.js";
import SendContainer from "./component/container/SendContainer/SendContainer.js";
import LastTxContainer from "./component/container/LastTxContainer/LastTxContainer";
import "./App.css";

class App extends Component {
  state = {
    loading: true,
    drizzleState: null,
  };

  componentDidMount = () => {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        this.setState({
          loading: false,
          drizzleState,
        });
      }
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render = () => {
    if (this.state.loading) {
      return (
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">Drizzle Status</h4>
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Router>
            <NavigationBar
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
            <div className="background" />
            <div className="content">
              <div className="left">
                <Switch unmountonblur="true">
                  <Route path="/message" exact>
                    <MessageContainer
                      drizzle={this.props.drizzle}
                      drizzleState={this.state.drizzleState}
                    />
                  </Route>
                  <Route path="/send" exact>
                    <SendContainer
                      drizzle={this.props.drizzle}
                      drizzleState={this.state.drizzleState}
                    />
                  </Route>
                  <Route path="/freezemoney" exact>
                    <FreezeMoneyContainer
                      drizzle={this.props.drizzle}
                      drizzleState={this.state.drizzleState}
                    />
                  </Route>
                  <Route path="/freezecontract" exact>
                    <FreezeContractContainer
                        drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}
                    />
                  </Route>
                </Switch>
              </div>
              <div className="right">
                <InfoContainer
                  drizzle={this.props.drizzle}
                  drizzleState={this.state.drizzleState}
                />
                <LastTxContainer
                  drizzle={this.props.drizzle}
                  drizzleState={this.state.drizzleState}
                />
              </div>
            </div>
          </Router>
        </React.Fragment>
      );
    }
  };
}

export default App;