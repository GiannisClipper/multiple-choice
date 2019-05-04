class LogoutMenu extends React.Component {
    //renders menu options when user NOT logged in

    render() {
        return (
            <div className="menu">
                <button onClick={this.props.onClick} value="Run">Run</button>
                <button onClick={this.props.onClick} value="Login">Login</button>
                <button onClick={this.props.onClick} value="Signup">Signup</button>
            </div>
        )
    }
}


class LoginMenu extends React.Component {
    //renders menu options when user logged in

    render() {
        return (
            <div className="menu">
                <button onClick={this.props.onClick} value="Run">Run</button>
                <button onClick={this.props.onClick} value="Works">Works</button>
                <button onClick={this.props.onClick} value="Profile">Profile</button>
                <button onClick={this.props.onClick} value="Logout">Logout</button>
            </div>
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


class GenericForm extends React.Component {
    //implements very basic functionality of a form

    constructor(props) {
        super(props);
        this.initFields = () => {return {}};
        this.state = {
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