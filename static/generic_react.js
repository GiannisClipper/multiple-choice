class GenericForm extends React.Component {
    //implements very basic functionality of a form

    constructor(props) {
        super(props);
        this.initFields = () => {return {}};
        this.state = {
            message: null,
            mode: null, //operation mode: create, search, read, update, delete
            editable: false, //make inputs editable or not
            fields: this.initFields(),
            changed: false
        };

        this.savedFields = null;
    }

    setSavedFields(data) {
        this.savedFields = this.initFields();
        Object.keys(this.savedFields).forEach(key => this.savedFields[key]=(typeof(data[key])==='undefined' || data[key]===null)?this.savedFields[key]:data[key]);
    }

    getSavedFields() {
        return Object.assign({}, deepCopy(this.savedFields));
    }

    inputChange(event) {
        this.setState({fields: Object.assign({}, this.state.fields, {[event.target.name]:event.target.value}), changed: true});
    }

}

class Message extends React.Component {
    //renders a box showing errors and messages

    render() {
        return (
            (this.props.message)?(
                <div className="message">
                    {(typeof this.props.message=='string')?(
                        <span>{this.props.message}</span>
                    ):null}
                    {(typeof this.props.message.error!='undefined')?(
                        <span className="error">error {this.props.message.error}</span>
                    ):null}
                    {(typeof this.props.message.message!='undefined')?(
                        this.props.message.message.map((item, index) => <span>{item}</span>)
                    ):null}

                </div>
            ):null
        )
    }
}

class CRUDMenu extends React.Component {
    //renders Create, Read, Update, Delete menu options

    render() {
        return (
            (this.props.mode==null)?(
                <div className="menu">
                <button onClick={this.props.createClick}>New</button>
                <button onClick={this.props.searchClick}>Search</button>
                <button onClick={this.props.closeClick}>Close</button>
                </div>
            ):(this.props.mode=='create')?(
                <div className="menu">
                <button onClick={this.props.okCreateClick} disabled={!this.props.changed}>Save</button>
                <button onClick={this.props.revertClick} disabled={!this.props.changed}>Revert</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):(this.props.mode=='search')?(
                <div className="menu">
                <button onClick={this.props.okSearchClick}>OK</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):(this.props.mode=='read')?(
                <div className="menu">
                <button onClick={this.props.createClick}>New</button>
                <button onClick={this.props.searchClick}>Search</button>
                <button onClick={this.props.updateClick}>Update</button>
                <button onClick={this.props.deleteClick}>Delete</button>
                <button onClick={this.props.closeClick}>Close</button>
                </div>
            ):(this.props.mode=='update')?(
                <div className="menu">
                <button onClick={this.props.okUpdateClick} disabled={!this.props.changed}>Save</button>
                <button onClick={this.props.revertClick} disabled={!this.props.changed}>Revert</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):(this.props.mode=='delete')?(
                <div className="menu">
                <button onClick={this.props.okDeleteClick}>Verify</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):null
        )
    }
}


class RUDMenu extends React.Component {
    //renders Read, Update, Delete menu options (like in a user's profile) 

    render() {
        return (
            (this.props.mode==null || this.props.mode=='read')?(
                <div className="menu">
                <button onClick={this.props.updateClick}>Update</button>
                <button onClick={this.props.deleteClick}>Delete</button>
                <button onClick={this.props.closeClick}>Close</button>
                </div>
            ):(this.props.mode=='update')?(
                <div className="menu">
                <button onClick={this.props.okUpdateClick} disabled={!this.props.changed}>Save</button>
                <button onClick={this.props.revertClick} disabled={!this.props.changed}>Revert</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):(this.props.mode=='delete')?(
                <div className="menu">
                <button onClick={this.props.okDeleteClick}>Verify</button>
                <button onClick={this.props.cancelClick}>Cancel</button>
                </div>
            ):null
        )
    }
}
