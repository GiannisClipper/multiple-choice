class RunWorksLogic extends GenericForm {
    //implements general functionality of the Run form

    constructor(props){
        super(props);

        this.initFields = () => {return {id:null, title:'', questions:[]}}
        this.state.fields = this.initFields();
        this.state.searchResults = [];
    }

    async searchClick(event) {
        this.savedFields = this.initFields();
        this.savedFields['title'] = '%';
        this.setState({mode:'search', fields:this.getSavedFields(), editable:true});
    }

    async okSearchClick(event) {
        await this.setState({editable:false});
        await request(`${document.globals.origin}/works?title=${this.state.fields.title}&user_id=${document.globals.user_id}`, 'GET', document.globals.token, null,
            (status, data) => {
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
                data.questions.forEach(q => q.answers.forEach(a => a.is_selected=false));
                this.setSavedFields(data);
                this.setState({mode:'run', fields:this.getSavedFields(), editable:true});
            },
            (status, message) => {
                this.setState({editable:true});
            }        
        );
    }

    async checkClick(event) {
        this.setState({mode:'check', editable:false});
    }
    
}


class RunWorksQuestionsLogic extends RunWorksLogic {
    //extends functionality for the Questions of the Run form

    constructor(props){
        super(props);
    }

}

class RunWorksQuestionsAnswersLogic extends RunWorksQuestionsLogic {
    //extends functionality for the Answers of the Run form

    constructor(props){
        super(props);
    }

    async changeAnswer(event, questIndex, index) {
        let fields = this.state.fields;
        let answers = fields.questions[questIndex].answers.slice();
        answers[index][event.target.name] = event.target.checked;
        fields.questions[questIndex].answers = answers;
        await this.setState({fields:fields, changed:true});
    }

}