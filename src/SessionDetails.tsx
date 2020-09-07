import React from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import {viewSessionLogs, viewSession} from './redux/modules/sessionList'
import './Recipes.css';
import './Session.css';
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const mapStateToProps = (state: RootState) => ({
    session: state.sessions.currentSession,
    sessionLogs: state.sessions.currentSessionLogs,
});  

const mapDispatchToProps =  {viewSessionLogs, viewSession};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const tableheaders = ["Machine", "Start Time", "End Time"]

const UnconnectedSessionDetails: React.FC<Props> = ( {session, sessionLogs, viewSession, viewSessionLogs} ) => {

  console.log("UnconnectedSessionDetails" )


  if( session === undefined || sessionLogs === undefined )
  {
      return (
        <Container>
             <h2 className="loading-title"> Loading Sessions.... </h2> <FontAwesomeIcon className="fa-spinner fa-spin" icon={faCircleNotch} size='2x'/>
        </Container>
      );
  }
  else 
  {  
    const options = {
        tooltips: {
            mode: 'index'
        }
    };    

    const data = {
        labels: sessionLogs.LogDate,  
        datasets: [
            {
                label: "Target",
                data: sessionLogs.TargetTemp,
                fill: false,
                borderColor: "#FF0000",
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: "Hex",
                data: sessionLogs.ThermoBlockTemp,
                fill: false,
                borderColor: "#FFFF00",
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: "Wort",
                data: sessionLogs.WortTemp,
                fill: false,
                borderColor: "#00FF00",
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: "Drain",
                data: sessionLogs.DrainTemp,
                fill: false,
                borderColor: "#0000FF",
                pointRadius: 0,
                borderWidth: 1
            },
            {
                label: "Ambient",
                data: sessionLogs.AmbientTemp,
                fill: false,
                borderColor: "#FF00FF",
                pointRadius: 0,
                borderWidth: 1
            }
        ]
      };


      // @TODO: Should this be -1 for length?
      const tableValues = [ session.machinename, sessionLogs.LogDate[0], sessionLogs.LogDate[sessionLogs.LogDate.length - 1] ]

    return (
        <Container>

            <div className="recipe-table">
                <div className="content-table">
                    <div className="table-flex-r">
                        <div className="pb-flex-r fg1">
                            <div className="col2 recipe-item fg1">
                            <h2> {session.recipename} </h2>
                            </div>
                            <div className="col2 recipe-item fg1">
                            <h2> {session.style} </h2>
                            </div>
                        </div>
                    </div>
                    <div className="table-flex-r">
                        <div className="label">
                            {sessionLogs.name}
                        </div>

                        <div className="pb-flex-r fg1">
                        { tableheaders.map( headerItem => (
                                <div className="recipe-item fg1 col3">
                                <b>{headerItem}</b>
                                </div>
                        ))}
                        </div>

                        <div className="pb-flex-r fg1">
                        { tableValues.map( value => (
                                <div className="recipe-item fg1 col3">
                                {value}
                                </div>
                        ))}
                        </div>

                    </div>
                </div>
            </div>
            <Line data={data} options={options} legend={{display: false}}/>
        </Container>
    );
  }
};


export const SessionDetails = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedSessionDetails);
