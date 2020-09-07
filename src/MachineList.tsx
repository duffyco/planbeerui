 import React, {useState} from 'react';
import { Container, Confirm } from "semantic-ui-react";
import { useEffect } from 'react';
import { RootState } from './redux';
import { loadMachines, setMachines, deleteMachine } from './redux/modules/machinelist';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {nSort} from './common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


import machinelogo from './z.svg'
import './MachineList.css';

const mapStateToProps = (state: RootState) => ({
  machines: state.machines.machines,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
        loadMachines,
        setMachines,
        deleteMachine
    },
    dispatch
  );
};

const machineListTitles = ["", "Token", "Name", "Firmware", "Uses Since Clean", "Last Used", "Status", "Trash"]

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const UnconnectedMachineList: React.FC<Props> = ({ deleteMachine, loadMachines, machines }) => {
  const[sortArray, setSortArray] = useState( [false, false, false, false, false, false, false, false] )
  const[open, setOpen] = useState( false );
  const[deleteToken, setDeleteToken] = useState( "" );

  useEffect(() => {
          if (machines.length === 0) {
            console.log( "REFRESHING MACHINES" );
            loadMachines();
          }
        }, [loadMachines, machines]);

        const handleCancel = (token: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          console.log( "handleCancel: " + token )
          setOpen( false );
      };

      const handleConfirm = (token: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          deleteMachine( token );
          setOpen( false );
      };

      const popupModal = (token: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          setDeleteToken( token );
          setOpen( true );
      }

    const sortAZ = (s: string, i: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      console.log( "sortAZ: " + s );
      var copyArray = sortArray.slice()
      setMachines( nSort( copyArray[i], s, machines ) )
      copyArray[i] = !copyArray[i] ;
      setSortArray ( copyArray );
    };
            

    return (
        <Container className="list-container">
        <h2 className="heading"> Machines </h2>
        <div className="pagemenu group">
        {machineListTitles.map( (machineTitle, i) => (
          <button className="btn sortbtn col8" onClick={sortAZ( machineTitle.replace(/\s+/g, ''), i )}>{machineTitle}</button>
        ))}          
        </div>

        {machines.map(machine => (
            <div className="machine-container group">
            {console.log( "Machines: " )}{ console.dir( machines )}
            {machine.token !== "" && 
              <Container>
                <div className="col8">
                    <img src={machinelogo} className="machine-logo" alt="logo" /> 
                </div>
                <div className="machine-detail col8">
                    {machine.token}
                </div>
                <div className="machine-detail col8">
                    {machine.name}
                </div>
                <div className="machine-detail col8">
                    {machine.firmware}
                </div>
                <div className="machine-detail col8">
                    {machine.usessinceclean}
                </div>
                <div className="machine-detail col8">
                    {machine.CurrentStatus.LastSeen}
                </div>
                <div className="machine-detail col8">
                    {machine.CurrentStatus.Status}
                </div>
                <div className="machine-detail col8">
                <button className="trashbtn btn" onClick={popupModal( machine.token ) } >
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
                <Confirm
                        content={"Delete Machine: " + deleteToken +" ?"}
                        open={open}
                        onCancel={handleCancel( deleteToken )}
                        onConfirm={handleConfirm( deleteToken )}
                    />    
                </div>
                </Container>
            }
            </div>
        ))}
        </Container>            
    );
};

export const MachineList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedMachineList);
