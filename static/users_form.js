class SignupForm extends SignupLogic {
    //renders Signup form (inherites all form functionality)

    render() {
        return (
            <div className="form">
                <div className="data">
                    <label>Username</label>
                    <input
                        type = "text"
                        name = "username" 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Password</label>
                    <input
                        type = "password"
                        name = "password" 
                        onChange = 
                        {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Repeat password</label>
                    <input
                        type = "password"
                        name = "password2" 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Email</label>
                    <input
                        type = "text"
                        name = "email" 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />
                </div>

                <div className="panel">
                    <h2>{this.props.title}</h2>

                    <div className="menu">
                        <button onClick = {this.okClick.bind(this)}>OK</button>
                        <button onClick = {this.props.handleMenu}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }

}


class LoginForm extends LoginLogic {
    //renders Login form (inherites all form functionality)

    render() {
        return (
            <div className="form">
                <div className="data">
                    <label>Username</label>
                    <input
                        type = "text"
                        name = "username" 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Password</label>
                    <input
                        type = "password"
                        name = "password" 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <div className="panel">
                        <h2>{this.props.title}</h2>

                        <div className="menu">
                            <button onClick = {this.okClick.bind(this)}>OK</button>
                            <button onClick = {this.props.handleMenu}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}


class LogoutForm extends LogoutLogic {
    //renders Logout form (inherites all form functionality)

    render() {
        return (
            <div className="form">
                <div className="panel">
                    <h2>{this.props.title}</h2>

                    <div className="menu">
                        <button onClick = {this.okClick.bind(this)}>OK</button>
                        <button onClick = {this.props.handleMenu}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }

}

    
class ProfileForm extends ProfileLogic {
    //renders user's Profile form (inherites all form functionality)

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="form">
                <div className="data">
                    <label>Username</label>
                    <input
                        type = "text"
                        name = "username" 
                        value = {this.state.fields.username} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Fullname</label>
                    <input
                        type = "text"
                        name = "fullname" 
                        value = {this.state.fields.fullname} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Password</label>
                    <input
                        type = "password"
                        name = "password" 
                        value = {this.state.fields.password} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Repeat password</label>
                    <input
                        type = "password"
                        name = "password2" 
                        value = {this.state.fields.password2} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>Email</label>
                    <input
                        type = "text"
                        name = "email"
                        value = {this.state.fields.email} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />

                    <label>About</label>
                    <textarea
                        name = "about" 
                        value = {this.state.fields.about} 
                        onChange = {this.inputChange.bind(this)} 
                        disabled = {!this.state.editable}
                    />
                </div>

                <div className="panel">
                    <h2>{this.props.title}</h2>

                    <RUDMenu 
                        mode = {this.state.mode}
                        updateClick = {this.updateClick.bind(this)}
                        deleteClick = {this.deleteClick.bind(this)}
                        closeClick = {this.props.handleMenu}
                        okUpdateClick = {this.okUpdateClick.bind(this)}
                        okDeleteClick = {this.okDeleteClick.bind(this)}
                        revertClick = {this.revertClick.bind(this)}
                        cancelClick = {this.cancelClick.bind(this)}
                    />
                </div>
            </div>
        )
    }
}