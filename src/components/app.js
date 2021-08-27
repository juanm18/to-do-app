import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import '../index.css';

class App extends Component {
constructor(props) {
	super(props);

	// Setting up state
	this.state = {
	userInput : "",
	list:[],
  paginationFilter: 10,
  currentPage: 0,
  totalPages: 0,
  taskCount: 0,
  paginatedList: [],
  error: false,
  errorClass: '',
  }
}

updateInputValue(inputValue) {
  this.setState({
    userInput: inputValue,
  });
}
// end updateInputValue

addNewItem() {
  if (this.state.userInput !== "" && this.isValidText()) {
    const newUserInput = {
      id: Math.random(),
      value: this.state.userInput,
    }
    const list = [...this.state.list];
    list.push(newUserInput);

    this.setState({
      userInput: "",
      list: list,
      paginatedList: list,
    });

    this.paginateTaskList(list);
    this.updateTaskCount(true);
    this.updateTotalPageCount(this.totalPages(list));
  }
}
// end addNewItem

deleteItem(item_id) {
  var list = this.state.list;
  var itemIndex = this.state.list.findIndex(item => item['id'] === item_id);

  list.splice(itemIndex, 1);

  this.setState({
    userInput: this.state.userInput,
    list:list,
  });

  this.paginateTaskList(list);
  this.updateTaskCount();
  this.updateTotalPageCount(this.totalPages(list));
}
// end deleteItem


totalPages(list = [], suppliedPaginationFilter = null) {
	if (suppliedPaginationFilter === null) {
		suppliedPaginationFilter = this.state.paginationFilter;
	}
  return Math.ceil(list.length / suppliedPaginationFilter);
}
// end totalPages

paginateTaskList(list = [], pageNum = false, paginationFilter = false) {
  if (pageNum === false) {
    pageNum = this.state.currentPage;
  }

  paginationFilter = paginationFilter === false ? this.state.paginationFilter : paginationFilter;
  // paginate list of tasks based on paginationFilter
  if (list.length > 0) {
    var paginated = list.slice(pageNum * paginationFilter, (pageNum * paginationFilter) + paginationFilter);
  }else {
    var paginated = this.state.list.slice(pageNum * paginationFilter, (pageNum * paginationFilter) + paginationFilter);
  }

  if (paginated.length === 0) {
    paginated = list;
  }

  this.setState({
    paginatedList: paginated,
    list: list,
    currentPage: pageNum,
  });
}
// end paginateTaskList

updateTotalPageCount(pageCount) {
  this.setState({
	   totalPages: pageCount,
  });
}
// end updateTotalPageCount

updateTaskCount(upCount = false) {
  this.setState({
    taskCount: !upCount ? this.state.taskCount - 1 : this.state.taskCount + 1,
  });
}
// end updateTaskCount

nextPage(pageNum){
this.paginateTaskList(this.state.list, pageNum);
}
// end nextPage

previousPage(pageNum) {
  this.paginateTaskList(this.state.list, pageNum);
}
// end previousPage

isValidText() {
  if (this.state.userInput.length > 69) {
    this.setState({
      error: true,
      errorClass: 'errorInput',
    });
    return false;
  }
  if (this.state.error === true) {
    this.setState({
      error:false,
      errorClass: '',
    });
  }
  return true;
}
// end isValidText

updatePaginationFilter(filter) {
  this.setState({
  	paginationFilter: filter,
  });

  this.paginateTaskList(this.state.list, false, filter);
  this.updateTotalPageCount(this.totalPages(this.state.list, filter));
}
// end updatePaginationFilter

render(){
	return (
    <Container>
    <Row style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: '3rem',
                fontWeight: 'bolder',
                textDecoration: 'underline'
              }}
              >TASK LIST
      </Row>

      <Dropdown>
      <Dropdown.Toggle variant="light" text='dark' id="dropdown-basic">
      Filter {"\n"}
      <Badge bg="secondary">{this.state.paginationFilter}</Badge>
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item onClick={ () => this.updatePaginationFilter(5) }>5</Dropdown.Item>
      <Dropdown.Item onClick={ () => this.updatePaginationFilter(10) }>10</Dropdown.Item>
      <Dropdown.Item onClick={ () => this.updatePaginationFilter(15) }>15</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>

      <Col md={{span: 6, offset: 3}}>
        <InputGroup className='mb-3'>
          <FormControl
            placeholder="Add a new task .."
            aria-label='note'
            onChange={(item)=> this.updateInputValue(item.target.value)}
            value={this.state.userInput}
            className={`${this.state.errorClass}`}
            />
            <Button
              variant='secondary'
              onClick={() => this.addNewItem()}>
              Submit
            </Button>
        </InputGroup>
        { this.state.error ? <Form.Text className='error'>You have exceeded the limit of 69 characters.</Form.Text> : null}
      <ListGroup id='list-group'>
        {
          this.state.paginatedList.map(item => {
          return (
            <ListGroup.Item className='mb-1' key={item.id} variant='dark'>{item.value} <CloseButton id='removeBtn' style={{ float: 'right' }} onClick={ () => this.deleteItem(item.id) }/></ListGroup.Item>
          )
        })}
      </ListGroup>
      <br/>
      <Button variant="dark">
        Task Count <Badge bg="secondary">{this.state.taskCount}</Badge>
      </Button>
      {"\n"}
      <div id='pageNav'>
        {this.state.currentPage < this.state.totalPages - 1 ? <Button variant='dark' size='sm' onClick={() => this.nextPage(this.state.currentPage + 1)}>Next{"\n"}</Button>: null}
        { this.state.totalPages > 1 ? <span id='pageNavText'>{"\n"}{this.state.currentPage + 1} of {this.state.totalPages}{"\n"}</span> : null}
        { this.state.currentPage > 0 ? <Button variant='dark' size='sm' onClick={() => this.previousPage(this.state.currentPage - 1)}>Previous</Button> : null}
      </div>
      </Col>
	  </Container>
	);
 }
}

export default App;
