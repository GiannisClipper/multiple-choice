class WorksLogic extends GenericForm {
    //implements general functionality of the Work form

    constructor(props){
        super(props);

        this.initFields = () => {return {id:null, title:'', questions:[]}}
        this.state.fields = this.initFields();
        this.state.searchResults = [];
    }

    async createClick(event) {
        await this.setState({mode:'create', fields:this.initFields(), editable:true});
    }

    async searchClick(event) {
        this.savedFields = this.initFields();
        this.savedFields['title'] = '%';
        this.setState({mode:'search', fields:this.getSavedFields(), editable:true});
    }

    async updateClick(event) {
        this.setState({mode:'update', editable:true});
    }

    async deleteClick(event) {
        this.setState({mode:'delete'});
    }

    async okCreateClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works`, 'POST', document.globals.token, this.state.fields,
            (status, data) => {
                this.setSavedFields(data);
                this.setState({mode:'update', editable:true});
            },
            (status, message) => {
                this.setState({editable:true});
            }        
        );
    }

    async okSearchClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works?title=${this.state.fields.title}&user_id=${document.globals.user_id}`, 'GET', document.globals.token, null,
            (status, data) => {
                //this.setSavedFields(data.items[0]);
                //this.setState({mode:'read', fields:this.getSavedFields()});
                let searchResults = [];
                data.items.forEach(x => searchResults.push({id:x.id, title:x.title}));
                this.setState({searchResults:searchResults, editable:true});
            },
            (status, message) => {
                this.setState({editable:true});
            }        
        );
    }

    async okReadClick(id) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works/${id}`, 'GET', document.globals.token, null,
            (status, data) => {
                this.setSavedFields(data);
                this.setState({mode:'read', fields:this.getSavedFields()});
            },
            (status, message) => {
                this.setState({editable:true});
            }        
        );
    }

    async okUpdateClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works/${this.state.fields.id}`, 'PUT', document.globals.token, this.state.fields,
            (status, data) => {
                this.setSavedFields(data);
                this.setState({editable:true});
            },
            (status, message) => {
                this.setState({editable:true});
            }
        );
    }

    async okDeleteClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works/${this.state.fields.id}`, 'DELETE', document.globals.token, null,
            (status, data) => {
                this.setState({mode:null});
            },
            (status, message) => {
                this.setState({editable:true});
            }
        );
    }

    async revertClick(event) {
        let fields = ['search', 'update'].includes(this.state.mode)?this.getSavedFields():this.initFields();
        this.setState({fields:fields});
    }

    async cancelClick(event) {
        let mode = ['update', 'delete'].includes(this.state.mode)?'read':null;
        let fields = ['update', 'delete'].includes(this.state.mode)?this.getSavedFields():this.initFields();
        this.setState({mode:mode, editable:false, fields:fields});
    }
}

class WorksQuestionsLogic extends WorksLogic {
    //extends functionality for the Questions of the Work form

    constructor(props){
        super(props);
    }

    async addQuestion() {
        let fields = this.state.fields;
        let questions = fields.questions.slice();
        questions.push({question:'', answers:[]});
        fields.questions = questions;
        await this.setState({fields:fields});
    }

    async changeQuestion(event, index) {
        let fields = this.state.fields;
        let questions = fields.questions.slice();
        questions[index][event.target.name] = event.target.value;
        fields.questions = questions;
        await this.setState({fields:fields});
    }

    async moveUpQuestion(index) {
        if (index > 0) {
            let fields = this.state.fields;
            let questions = fields.questions.slice();
            let tmp = questions[index-1];
            questions[index-1] = questions[index];
            questions[index] = tmp;
            fields.questions = questions;
            await this.setState({fields:fields});
        }
    }

    async moveDownQuestion(index) {
        if (index < this.state.fields.questions.length - 1) {
            let fields = this.state.fields;
            let questions = fields.questions.slice();
            let tmp = questions[index+1];
            questions[index+1] = questions[index];
            questions[index] = tmp;
            fields.questions = questions;
            await this.setState({fields:fields});
        }
    }

    async removeQuestion(index) {
        let fields = this.state.fields;
        let questions = fields.questions.slice();
        questions.splice(index,1);
        fields.questions = questions;
        await this.setState({fields:fields});
    }
}

class WorksQuestionsAnswersLogic extends WorksQuestionsLogic {
    //extends functionality for the Answers of the Work form

    constructor(props){
        super(props);
    }

    async addAnswer(questIndex) {
        let fields = this.state.fields;
        let answers = fields.questions[questIndex].answers.slice();
        answers.push({answer:'', is_correct:false});
        fields.questions[questIndex].answers = answers;
        await this.setState({fields:fields});
    }

    async changeAnswer(event, questIndex, index) {
        let fields = this.state.fields;
        let answers = fields.questions[questIndex].answers.slice();
        if (event.target.type=='checkbox') {
            answers[index][event.target.name] = event.target.checked;
        } else {
            answers[index][event.target.name] = event.target.value;
        }
        fields.questions[questIndex].answers = answers;
        await this.setState({fields:fields});
    }

    async moveUpAnswer(questIndex, index) {
        if (index > 0) {
            let fields = this.state.fields;
            let questions = [...fields.questions];
            let answers = [...questions[questIndex].answers];
            let tmp = answers[index-1];
            answers[index-1] = answers[index];
            answers[index] = tmp;
            questions[questIndex].answers = answers;
            fields.questions = questions;
            await this.setState({fields:fields});
        }
    }

    async moveDownAnswer(questIndex, index) {
        if (index < this.state.fields.questions[questIndex].answers.length - 1) {
            let fields = this.state.fields;
            let questions = [...fields.questions];
            let answers = [...questions[questIndex].answers];
            let tmp = answers[index+1];
            answers[index+1] = answers[index];
            answers[index] = tmp;
            questions[questIndex].answers = answers;
            fields.questions = questions;
            await this.setState({fields:fields});
        }
    }

    async removeAnswer(questIndex, index) {
        let fields = this.state.fields;
        let answers = fields.questions[questIndex].answers.slice();
        answers.splice(index,1);
        fields.questions[questIndex].answers = answers;
        await this.setState({fields:fields});
    }
}