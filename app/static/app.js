class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {menuSelection:null};
        document.globals = {origin:'https://gc-multiple-choice.herokuapp.com/api/v1', user_id:null, username:null, token:null} //'http://localhost:5000/api/v1'
    }

    handleMenuClick(event){
        this.setState({menuSelection:event.target.value});
    }

    handleMenu(event, value=null) {
        this.setState({menuSelection:value});
    }

    render(){
        return (
            <div className='containerH'>
                <div className='containerV'>
                    <header>
                        <h1>Your Multiple Choice!</h1>
                        {!document.globals.username && <LogoutMenu onClick={this.handleMenuClick.bind(this)} />}
                        {document.globals.username && <LoginMenu onClick={this.handleMenuClick.bind(this)} />}
                    </header>

                    <main>
                        {this.state.menuSelection===null && <HomeForm />}
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

class HomeForm extends React.Component {
    //renders home form

    render() {
        return (
            <div className="form home">
                <div className="data">
                    <p>This is a demo web application. Back-end and front-end are totally seperated. Back-end is a RESTful API developed in Python/Flask, using an SQL database and responding in JSON format. Front-end is a single-page application developed in ReactJS.</p>
                    <p>Registered users can create their own multiple-choice works/tests. Signing up requires a username, a password and a valid email through which a new account will be activated. Although application follows the recommented security rules (ex. stores hashes instead of actual passwords), you are advised not to use same passwords like email or bank accounts and not expose other crucial personal data (remember is just a demo).</p>
                    <p>Any user, registered or not, can search existing works/tests by title and run/execute them. Each mutliple-choice work/test may have up to 12 questions and each question up to 8 answers.</p>
                    <p>Enjoy creating or solving multiple-choice works/tests.</p>
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
