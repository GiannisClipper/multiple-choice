class WorksForm extends WorksQuestionsAnswersLogic {
    //renders Work form (inherites all form functionality)

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form">

                <div className="data">
                    <Work 
                        mode = {this.state.mode}
                        fields = {this.state.fields}
                        inputChange = {this.inputChange.bind(this)} 
                        editable = {this.state.editable}

                        searchResults = {this.state.searchResults}
                        okReadClick = {this.okReadClick.bind(this)} 

                        addQuestion = {this.addQuestion.bind(this)}
                        changeQuestion = {this.changeQuestion.bind(this)} 
                        moveUpQuestion = {this.moveUpQuestion.bind(this)}
                        moveDownQuestion = {this.moveDownQuestion.bind(this)} 
                        removeQuestion = {this.removeQuestion.bind(this)}

                        addAnswer = {this.addAnswer.bind(this)}
                        changeAnswer = {this.changeAnswer.bind(this)}
                        moveUpAnswer = {this.moveUpAnswer.bind(this)}
                        moveDownAnswer = {this.moveDownAnswer.bind(this)} 
                        removeAnswer = {this.removeAnswer.bind(this)} 
                    />
                </div>
                
                <Message 
                    message = {this.state.message}
                />

                <div className="panel">
                    <h2>{this.props.title}</h2>

                    <CRUDMenu
                        mode = {this.state.mode}
                        changed = {this.state.changed}
                        createClick = {this.createClick.bind(this)}
                        searchClick = {this.searchClick.bind(this)}
                        updateClick = {this.updateClick.bind(this)}
                        deleteClick = {this.deleteClick.bind(this)}
                        closeClick = {this.props.handleMenu}
                        okCreateClick = {this.okCreateClick.bind(this)}
                        okSearchClick = {this.okSearchClick.bind(this)}
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


class Work extends React.Component {
    //renders data part of Work form

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

        this.questionsList = () => <QuestionsList
            questions = {this.props.fields.questions}

            addQuestion = {this.props.addQuestion}
            changeQuestion = {this.props.changeQuestion}
            moveUpQuestion = {this.props.moveUpQuestion}
            moveDownQuestion = {this.props.moveDownQuestion}
            removeQuestion = {this.props.removeQuestion}

            addAnswer = {this.props.addAnswer}
            changeAnswer = {this.props.changeAnswer}
            moveUpAnswer = {this.props.moveUpAnswer}
            moveDownAnswer = {this.props.moveDownAnswer}
            removeAnswer = {this.props.removeAnswer}

            editable = {this.props.editable}
        />
    }

    render() {
        return (
            (this.props.mode=='search')?(
                <div className="work">
                    {this.searchResults()}
                    <label>Search works by title</label>
                    {this.inputTitle()}
                </div>
            ):(this.props.mode)?(
                <div className="work">
                    {this.inputTitle()}
                    {this.questionsList()}
                </div>
            ):null
        )
    }
}


class QuestionsList extends React.Component {
    //renders Questions list 

    render() {
        const total = this.props.questions.length;

        return (
            <ul>
            {this.props.questions.map((item, index) => 
                <Question 
                    key = {index}
                    index = {index}
                    total = {total}

                    question = {item}
                    changeQuestion = {this.props.changeQuestion}
                    moveUpQuestion = {this.props.moveUpQuestion}
                    moveDownQuestion = {this.props.moveDownQuestion}
                    removeQuestion = {this.props.removeQuestion}

                    addAnswer = {this.props.addAnswer}
                    changeAnswer = {this.props.changeAnswer}
                    moveUpAnswer = {this.props.moveUpAnswer}
                    moveDownAnswer = {this.props.moveDownAnswer}
                    removeAnswer = {this.props.removeAnswer}

                    editable = {this.props.editable}
                />
            )}
            
            {(this.props.editable && total<12)?(
                <button
                    className = "add-question"
                    onClick = {() => this.props.addQuestion()}
                    disabled = {!this.props.editable}
                >+ Question</button>
            ):null}

            </ul>
        )
    }
}


class Question extends React.Component {
    //renders Question item 

    render() {
        return (
            <div className="question">
                <QuestionPart1
                    index = {this.props.index}
                    total = {this.props.total}
                    moveUpQuestion = {this.props.moveUpQuestion}
                    moveDownQuestion = {this.props.moveDownQuestion}
                    editable = {this.props.editable}
                />

                <QuestionPart2
                    index = {this.props.index}
                    question = {this.props.question}
                    changeQuestion = {this.props.changeQuestion}
                    editable = {this.props.editable}

                    addAnswer = {this.props.addAnswer}
                    changeAnswer = {this.props.changeAnswer}
                    moveUpAnswer = {this.props.moveUpAnswer}
                    moveDownAnswer = {this.props.moveDownAnswer}
                    removeAnswer = {this.props.removeAnswer}
                />

                <QuestionPart3
                    index = {this.props.index}
                    removeQuestion = {this.props.removeQuestion}
                    editable = {this.props.editable}
                />
            </div>
        )
    }
}

class QuestionPart1 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part1">
                <div className="index">
                    {this.props.index+1}
                </div>

                {(this.props.editable && this.props.index>0)?(
                    <button
                        onClick = {() => this.props.moveUpQuestion(this.props.index)}
                        disabled = {!this.props.editable}
                    >&#8673;</button>
                ):null}

                {(this.props.editable && this.props.index<this.props.total-1)?(
                    <button 
                        onClick = {() => this.props.moveDownQuestion(this.props.index)}
                        disabled = {!this.props.editable}
                    >&#8675;</button>
                ):null}
            </div>
        )
    }
}

class QuestionPart2 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part2">
                <textarea
                    name = 'question'
                    placeholder = 'Question...'
                    value = {this.props.question.question}
                    onChange = {(event) => this.props.changeQuestion(event, this.props.index)}
                    disabled = {!this.props.editable}
                />

                <AnswersList
                    questIndex = {this.props.index}
                    answers = {this.props.question.answers}
                    addAnswer = {this.props.addAnswer}
                    changeAnswer = {this.props.changeAnswer}
                    moveUpAnswer = {this.props.moveUpAnswer}
                    moveDownAnswer = {this.props.moveDownAnswer}
                    removeAnswer = {this.props.removeAnswer}
                    editable = {this.props.editable}
                />
            </div>
        )
    }
}

class QuestionPart3 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part3">
                {(this.props.editable)?(
                    <button 
                        onClick = {() => this.props.removeQuestion(this.props.index)}
                        disabled = {!this.props.editable}
                    >&#10007;</button>
                ):null}
            </div>
        )
    }
}

class AnswersList extends React.Component {
    //renders Answers list 

    render() {
        const total = this.props.answers.length;

        return (
            <ul>
            {this.props.answers.map((item, index) => 
                <Answer 
                    key = {index}
                    questIndex = {this.props.questIndex}
                    index = {index}
                    total = {total}
                    answer = {item}
                    changeAnswer = {this.props.changeAnswer}
                    moveUpAnswer = {this.props.moveUpAnswer}
                    moveDownAnswer = {this.props.moveDownAnswer}
                    removeAnswer = {this.props.removeAnswer}
                    editable = {this.props.editable}
                />
            )}

            {(this.props.editable && total<8)?(
                <button
                    className = "add-answer"
                    onClick = {() => this.props.addAnswer(this.props.questIndex)}
                    disabled = {!this.props.editable}
                >+ Answer</button>
            ):null}

            </ul>
        )
    }
}


class Answer extends React.Component {
    //renders Answer item 

    render() {
        return (
            <div className="answer">
                <AnswerPart1
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                    total = {this.props.total}
                    answer = {this.props.answer}
                    changeAnswer = {this.props.changeAnswer}
                    moveUpAnswer = {this.props.moveUpAnswer}
                    moveDownAnswer = {this.props.moveDownAnswer}
                    editable = {this.props.editable}
                />

                <AnswerPart2
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                    answer = {this.props.answer}
                    changeAnswer = {this.props.changeAnswer}
                    editable = {this.props.editable}
                />

                <AnswerPart3
                    questIndex = {this.props.questIndex}
                    index = {this.props.index}
                    removeAnswer = {this.props.removeAnswer}
                    editable = {this.props.editable}
                />
            </div>
        )
    }
}

class AnswerPart1 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part1">
                <div className="index">
                    <input
                        type = "checkbox"
                        name = "is_correct"
                        value = {this.props.answer.is_correct}
                        checked = {this.props.answer.is_correct}
                        onChange = {(event) => this.props.changeAnswer(event, this.props.questIndex, this.props.index)}
                        disabled = {!this.props.editable}
                    />

                    {'ABCDEFGH'.substring(this.props.index, this.props.index+1)}
                </div>

                <div className="index">
                    {(this.props.editable && this.props.index>0)?(
                        <button 
                            onClick = {() => this.props.moveUpAnswer(this.props.questIndex, this.props.index)}
                            disabled = {!this.props.editable}
                        >&#8673;</button>
                    ):null}

                    {(this.props.editable && this.props.index<this.props.total-1)?(
                        <button 
                            onClick = {() => this.props.moveDownAnswer(this.props.questIndex, this.props.index)}
                            disabled = {!this.props.editable}
                        >&#8675;</button>
                    ):null}
                </div>
            </div>
        )
    }
}

class AnswerPart2 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part2">
                <textarea
                    name = "answer"
                    placeholder = "Answer... (mark on the left if correct)"
                    value = {this.props.answer.answer}
                    onChange = {(event) => this.props.changeAnswer(event, this.props.questIndex, this.props.index)}
                    disabled = {!this.props.editable}
                />
            </div>
        )
    }
}

class AnswerPart3 extends React.Component {
    //renders part of Answer item 

    render() {
        return (
            <div className="part3">
                {(this.props.editable)?(
                    <button 
                        onClick = {() => this.props.removeAnswer(this.props.questIndex, this.props.index)}
                        disabled = {!this.props.editable}
                    >&#10007;</button>
                ):null}
            </div>
        )
    }
}
