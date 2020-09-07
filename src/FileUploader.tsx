
import React, {useState, useRef} from "react";
import { RootState } from "./redux";
import { connect } from 'react-redux';
import { Button, Form } from "semantic-ui-react";
import './Recipes.css';
import {uploadFiles} from './redux/modules/settingsview'
import { bindActionCreators, Dispatch } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faCloudUploadAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import './FileUploader.css'

type FileUploadProps = {
  type: string,
};

const mapStateToProps = (state: RootState, ownProps: FileUploadProps ) => ({
  type: ownProps.type,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
      {
        uploadFiles,
      },
      dispatch
    );
  };

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const UnconnectedFileUploaderView: React.FC<Props> = ( {type, uploadFiles} ) => {
  const [files, setFiles] = useState<any[]>( [] );
  const [fileNames, setFileNames] = useState<string[]>( [] );
  const [uploading, setUploading] = useState<boolean>( false );
  const fileInputRef = useRef<HTMLInputElement>( null );
  console.log( "UnconnectedFileUploaderView")

/*  if( reset ) {
    setFiles( [] );
    setFileNames( [] );
    setUploading( false );
  }
*/
  //@TODO: Fix this.  
  const fileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const t = event.target.files;
    if( t ) 
    {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const b = event.target

        if( b )
        {
          setFiles( [...files, b.result] ) ;
        }
      });

      if( t.length > 0 ) {
        reader.readAsText(t[0]);
        setFileNames( [...fileNames, t[0].name] );
      }
    }
  };

  const setFileUploading = (type: string, files: string[], fileNames: string[]) => (e: React.MouseEvent) => {
    setUploading( true );
    uploadFiles( type, files, fileNames );
    setFileNames( [] )
    setFiles( [] )
  }


  return (
    <Form >
      <div className="col2 group uploadbtn">
      { fileNames.length > 0 && 
        <button className="btn col2" onClick={() => { const node = fileInputRef.current;
          if ( node ) {
            node.click();
          }
        } }>
        {fileNames.length == 1 && fileNames[0] } 
        {fileNames.length > 1 && fileNames.length + " Files Selected "}
        </button>
      }
      { fileNames.length == 0 && 
        <button className="btn col2" onClick={() => { const node = fileInputRef.current;
          if ( node ) {
            node.click();
          }
        } }>
        Select File <FontAwesomeIcon icon={faFile} size='1x'/>
        </button>
      }
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={fileInputChange}
      />
      </div>
      <div className="col2 group uploadbtn">
        { fileNames.length > 0 &&
        <button className="btn col2" type="submit" onClick={setFileUploading( type, files, fileNames ) }>
        Import <FontAwesomeIcon icon={faCloudUploadAlt} size='1x'/>
        </button>
        }
      </div>
    </Form>
  );
};


export const FileUploadView = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedFileUploaderView);
