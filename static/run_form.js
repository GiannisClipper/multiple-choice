class RunMenu extends React.Component {
    //renders Run menu options (search, run and check a multiple-choice test)

    render() {
        return (
            (this.props.mode=='search')?(
                <div className="menu">
                <button onClick={this.props.okSearchClick}>Search</button>
                <button onClick={this.props.closeClick}>Close</button>
                </div>
            ):(this.props.mode=='run')?(
                <div className="menu">
                <button onClick={this.props.checkClick}>Check</button>
                <button onClick={this.props.searchClick}>Cancel</button>
                </div>
            ):(this.props.mode=='check')?(
                <div className="menu">
                <button onClick={this.props.closeClick}>Close</button>
                </div>
            ):null
        )
    }
}


class RunWorksForm extends RunWorksQuestionsAnswersLogic {
    //renders Run form (inherites all form functionality)

    constructor(props) {
        super(props);

        this.savedFields = this.initFields();
        this.savedFields['title'] = '%';
        this.state.mode = 'search';
        this.state.fields = this.getSavedFields();
        this.state.editable = true;
    }

    render() {
        return (
            <div className="form">

                <div className="data">
                    <RunWork 
                        mode = {this.state.mode}
                        fields = {this.state.fields}
                        inputChange = {this.inputChange.bind(this)}
                        editable = {this.state.editable}

                        searchResults = {this.state.searchResults}
                        okReadClick = {this.okReadClick.bind(this)} 

                        changeAnswer = {this.changeAnswer.bind(this)}
                    />
                </div>

                <Message 
                    message = {this.state.message}
                />

                <div className="panel">
                    <h2>{this.props.title}</h2>

                    <RunMenu
                        mode = {this.state.mode}
                        changed = {this.state.changed}
                        searchClick = {this.searchClick.bind(this)}
                        closeClick = {this.props.handleMenu}
                        okSearchClick = {this.okSearchClick.bind(this)}
                        checkClick = {this.checkClick.bind(this)}
                    />
                </div>

            </div>
        )
    }
}


class RunWork extends React.Component {
    //renders data part of Run form

    constructor(props) {
        super(props);

        this.inputTitle = () => <input 
            type = "text"
            name = "title"
            placeholder = "Work title..."
            value = {this.props.fields.title} 
            onChange = {this.props.inputChange}
            disabled = {!this.props.editable}
        />

        this.searchResults = () => <ul className="search-results">
            {this.props.searchResults.map((x, i) => 
                <li onClick = {() => this.props.okReadClick(x.id)}>
                    {x.title}
                </li>
            )}
        </ul>

        this.questionsList = () => <RunQuestionsList
            mode = {this.props.mode}
            questions = {this.props.fields.questions}
            changeAnswer = {this.props.changeAnswer}
            editable = {this.props.editable}
        />
    }

    render() {
        return (
            (this.props.mode=='search')?(
                <div className="work">
                    {this.searchResults()}
                    {this.inputTitle()}
                </div>
            ):(this.props.mode)?(
                <div className="work">
                    <div>{this.props.fields.title}</div>
                    {this.questionsList()}
                </div>
            ):null
        )
    }
}


class RunQuestionsList extends React.Component {
    //renders Questions list for Run form

    render() {
        const total = this.props.questions.length;

        return (
            <ul>
            {this.props.questions.map((item, index) => 
                <RunQuestion 
                    mode = {this.props.mode}
                    key = {index}
                    index = {index}
                    total = {total}

                    question = {item}
                    changeAnswer = {this.props.changeAnswer}
                    editable = {this.props.editable}
                />
            )}
            </ul>
        )
    }
}


class RunQuestion extends React.Component {
    //renders Question item for Run form

    render() {
        const error = this.props.mode=='check' && !questionResult(this.props.question);

        return (
            <div className={"question"+(error?" error":"")}>
                <RunQuestionPart1
                    index = {this.props.index}
                    total = {this.props.total}
                />

                <RunQuestionPart2
                    mode = {this.props.mode}
                    index = {this.props.index}
                    question = {this.props.question}
                    editable = {this.props.editable}
                    changeAnswer = {this.props.changeAnswer}
                />

                <RunQuestionPart3
                    index = {this.props.index}
                />
            </div>
        )
    }
}

class RunQuestionPart1 extends React.Component {
    //renders part of Answer item for Run form

    render() {
        return (
            <div className="part1">
                <div>
                    {this.props.index+1})
                </div>
            </div>
        )
    }
}

class RunQuestionPart2 extends React.Component {
    //renders part of Answer item for Run form

    render() {
        return (
            <div className="part2">
                <pre>{this.props.question.question}</pre>

                <RunAnswersList
                    mode = {this.props.mode}
                    questIndex = {this.props.index}
                    answers = {this.props.question.answers}
                    changeAnswer = {this.props.changeAnswer}
                    editable = {this.props.editable}
                />
            </div>
        )
    }
}

class RunQuestionPart3 extends React.Component {
    //renders part of Answer item for Run form

    render() {
        return (
            <div className="part3">
            </div>
        )
    }
}

class RunAnswersList extends React.Component {
    //renders Answers list for Run form

    render() {
        const total = this.props.answers.length;

        return (
            <ul>
            {this.props.answers.map((item, index) => 
                <RunAnswer 
                    mode = {this.props.mode}
                    key = {index}
                    questIndex = {this.props.questIndex}
                    index = {index}
                    total = {total}
                    answer = {item}
                    changeAnswer = {this.props.changeAnswer}
                    editable = {this.props.editable}
                />
            )}
            </ul>
        )
    }
}


class RunAnswer extends React.Component {
    //renders Answer item for Run form

    render() {
        return (
            <div className="answer">
                <RunAnswerPart1
                    mode = {this.props.mode}
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                    total = {this.props.total}
                    answer = {this.props.answer}
                    changeAnswer = {this.props.changeAnswer}
                    editable = {this.props.editable}
                />

                <RunAnswerPart2
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                    answer = {this.props.answer}
                />

                <RunAnswerPart3
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                />
            </div>
        )
    }
}

class RunAnswerPart1 extends React.Component {
    //renders part of Answer item for Run form

    render() {
        return (
            <div className="part1">
                <div className="index">

                    {(this.props.mode=='check')?(
                        (this.props.answer.is_correct)?(
                            <span className="result">&#x2713;</span>):(
                            <span className="result">&#x2715;</span>)
                    ):null}

                    <input
                        type = "checkbox"
                        name = "is_selected"
                        value = {this.props.answer.is_selected}
                        checked = {this.props.answer.is_selected}
                        onChange = {(event) => this.props.changeAnswer(event, this.props.questIndex, this.props.index)}
                        disabled = {!this.props.editable}
                    />
                    
                    <span>{'ABCDEFGH'.substring(this.props.index, this.props.index+1)})</span>
                </div>

            </div>
        )
    }
}

class RunAnswerPart2 extends React.Component {
    //renders part of Answer item for Run form

    render() {
        return (
            <div className="part2">
                <pre>{this.props.answer.answer}</pre>
            </div>
        )
    }
}

class RunAnswerPart3 extends React.Component {
    //renders part of Answer item for Run form 

    render() {
        return (
            <div className="part3">
            </div>
        )
    }
}
