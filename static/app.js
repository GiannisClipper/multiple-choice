class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {menuSelection:null};
        document.globals = {origin:'http://localhost:5000/api/v1', user_id:null, username:null, token:null}
    }

    handleMenuClick(event){
        this.setState({menuSelection:event.target.value});
    }

    handleMenu(value=null) {
        this.setState({menuSelection:value});
    }

    render(){
        console.log(`${document.globals.origin}, ${document.globals.user_id}:${document.globals.username}, ${document.globals.token}`);
        return (
            <div className='containerH'>
                <div className='containerV'>
                    <header>
                        <h1>Your Multiple Choice!</h1>
                        {!document.globals.username && <LogoutMenu onClick={this.handleMenuClick.bind(this)} />}
                        {document.globals.username && <LoginMenu onClick={this.handleMenuClick.bind(this)} />}
                    </header>

                    <main>
                        {this.state.menuSelection==='Run' && <RunWorksForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                        {this.state.menuSelection==='Signup' && <SignupForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                        {this.state.menuSelection==='Login' && <LoginForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                        {this.state.menuSelection==='Works' && <WorksForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                        {this.state.menuSelection==='Profile' && <ProfileForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                        {this.state.menuSelection==='Logout' && <LogoutForm title={this.state.menuSelection} handleMenu={this.handleMenu.bind(this)} />}
                    </main>

                    <svg className="corner" viewBox="0 0 100 100">
                        <polygon points="100,0 100,100 0,100" />
                    </svg>

                    <footer>
                        <a href="https://github.com/giannisclipper">Giannis Clipper<br/>Athens 2019</a>
                    </footer>
                </div>
            </div>
        )
    }
  
}


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
