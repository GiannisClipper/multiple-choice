class SignupLogic extends GenericForm {
    //implements functionality of the Signup form

    constructor(props) {
        super(props);
        Object.assign(this.state, {mode:null, editable:true, fields:{username:null, password:null, password2:null, email:null}});
    }

    async okClick(event){
        if (this.state.mode=='message') {
            this.props.handleMenu(null, 'Login'),
            this.setState({message:message, editable:false})
        } else {
            await this.setState({editable:false});
            let data = {username:this.state.fields.username, password:this.state.fields.password, password2:this.state.fields.password2, email:this.state.fields.email};
            await request(`${document.globals.origin}/users`, 'POST', null, data,
                (status, data) => {
                    //this.props.handleMenu('Login'),
                    let message = 'Check your email to activate the new account'
                    this.setState({mode:'message', message:message, editable:false})
                },
                (status, message) => {
                    this.setState({message:message, editable:true});
                }        
            );
        }
    }

}


class LoginLogic extends GenericForm {
    //implements functionality of the Login form

    constructor(props) {
        super(props);
        Object.assign(this.state, {editable:true, fields:{username:null, password:null}});
    }

    async okClick(event){
        await this.setState({editable:false});
        
        let data = {username:this.state.fields.username, password:this.state.fields.password};
        await request(`${document.globals.origin}/users/login`, 'POST', null, data,
            (status, data) => {
                document.globals.user_id = data.id;
                document.globals.username = data.username;
                document.globals.token = data.token;
                this.props.handleMenu(),
                this.setState({editable:true})
            },
            (status, message) => {
                this.setState({message:message.error, editable:true});
            }        
        );
    }

}


class LogoutLogic extends GenericForm {
    //implements functionality of the Logout form

    async okClick(event) {
        Object.assign(this.state, {editable:false});

        await request(`${document.globals.origin}/users/logout`, 'POST', document.globals.token, null, null, null);
        document.globals.user_id = null;
        document.globals.username = null;
        document.globals.token = null;
        this.props.handleMenu()
    }

}


class ProfileLogic extends GenericForm {
    //implements functionality of the user's Profile form

    constructor(props) {
        super(props);

        this.initFields = () => {return {username:'', fullname:'', password:'', password2:'', email:'', about:''}};
        this.state.fields = this.initFields();

        this.read();
    }

    async read() {
        await request(`${document.globals.origin}/users/${document.globals.user_id}`, 'GET', document.globals.token, null,
            (status, data) => {
                this.setSavedFields(data);
                this.setState({mode:'read', fields:this.getSavedFields()});
            }
        );
    }

    async updateClick(event) {
        this.setState({mode:'update', editable:true});
    }

    async deleteClick(event) {
        this.setState({mode:'delete'});
    }

    async okUpdateClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/users/${document.globals.user_id}`, 'PUT', document.globals.token, this.state.fields,
            (status, data) => {
                this.setSavedFields(data);
                this.setState({editable:true, changed:false});
            },
            (status, message) => {
                this.setState({message:message, editable:true});
            }        
        );
    }

    async okDeleteClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/users/${document.globals.user_id}`, 'DELETE', document.globals.token, null,
            (status, data) => {
                document.globals.user_id = null;
                document.globals.username = null;
                document.globals.token = null;
                this.props.handleMenu();
            },
            (status, message) => {
                this.setState({message:message, editable:true});
            }
        );
    }

    async revertClick(event) {
        this.setState({fields:this.getSavedFields(), changed:false});
    }

    async cancelClick(event) {
        this.setState({mode:'read', editable:false, fields:this.getSavedFields(), changed:false});
    }
}