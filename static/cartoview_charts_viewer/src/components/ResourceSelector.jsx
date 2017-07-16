import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import Img from 'react-image';
import Spinner from 'react-spinkit'
import Switch from 'react-toggle-switch'
import 'react-toggle-switch/dist/css/switch.min.css'
export default class ResourceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      loading: true,
      showPagination: true,
      pageCount: 0,
      mymaps:true
    }
  }
  loadResources(off) {
    this.setState({loading: true})
    const limit = typeof(this.props.limit) === "undefined"
      ? 100
      : this.props.limit;
    const offset = typeof(off) === "undefined"
      ? 0
      : off;
    let userMapsFilter = this.state.mymaps
      ? ("&" +
      "owner__username" +
      "=" + this.props.username + "")
      : "";
    fetch(this.props.resourcesUrl + "?limit=" + limit + "&" + "offset=" + offset + userMapsFilter).then((response) => response.json()).then((data) => {
      this.setState({
        resources: data.objects,
        pageCount: Math.ceil(data.meta.total_count / limit),
        loading: false
      })
    }).catch((error) => {
      console.error(error);
    });
  }
  componentDidMount() {
    this.loadResources(0)
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    const offset = data.selected * this.props.limit;
    this.loadResources(offset)

  };
  handleUserMapsChecked() {
    const flag_maps=this.state.mymaps
    console.log("before",flag_maps);
    this.setState({mymaps:!flag_maps},()=>this.loadResources(0));
    console.log("after",flag_maps);

  }
  handleSearch() {
    if (this.refs.search.value != '') {
      this.setState({loading: true})
      let userMapsFilter = this.state.mymaps
        ? ("&" +
        "owner__username" +
        "=" + this.props.username + "")
        : "";
      fetch(this.props.resourcesUrl + "?" + "title__icontains" + "=" + this.refs.search.value + userMapsFilter).then((response) => response.json()).then((data) => {
        this.setState({resources: data.objects, loading: false})
      }).catch((error) => {
        console.error(error);
      });
    }

  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <h4>{"Select Map "}</h4>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            {(this.props.instance
              ? this.props.instance
              : false)
              ? <button className="btn btn-primary pull-right" onClick={() => this.props.onComplete()}>Next</button>
              : <button className="btn btn-primary pull-right" onClick={() => this.props.onComplete()} disabled>Next</button>}
          </div>

        </div>
        <hr></hr>
        <div className="row" style={{
          paddingBottom: 10
        }}>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4" style={{
            display: 'flex'
          }}>
            <span style={{
              fontWeight: 500,
              marginRight: 10
            }}>{'All Maps'}</span>
          <Switch on={this.state.mymaps} onClick={this.handleUserMapsChecked.bind(this)}/>
            <span style={{
              fontWeight: 500,
              marginLeft: 10
            }}>{'My Maps'}</span>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8">

              <input type="text" className="form-control" ref="search" defaultValue={''} onChange={this.handleSearch.bind(this)} placeholder="Search by title"/>

          </div>
        </div>
        {(!this.state.resources || this.state.loading) && <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 text-center"><Spinner name="line-scale-pulse-out" color="steelblue"/></div>
        </div>}
        {!this.state.loading && this.state.resources.map((resource) => {
          return <div onClick={() => this.props.selectMap(resource)} key={resource.id} className={(this.props.instance
            ? (this.props.instance && this.props.instance.id == resource.id)
            : false)
            ? "row resource-box bg-success"
            : "row resource-box"}>
            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 resource-box-img-container"><Img className="resource-box-img img-responsive" src={[resource.thumbnail_url, "/static/app_manager/img/no-image.jpg"]} loader={< Spinner name = "line-scale-pulse-out" color = "steelblue" />}/></div>
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 resource-box-text">
              <ul className="list-group">
                <li className="list-group-item">title: {resource.title}</li>
                <li className="list-group-item">abstract: {resource.abstract.length > 30
                    ? resource.abstract.substr(0, 30) + '...'
                    : resource.abstract}</li>
                <li className="list-group-item">owner: {resource.owner__username}</li>
              </ul>
            </div>
          </div>
        })}
        {(!this.state.loading && this.state.resources.length==0 && this.state.mymaps) && <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 text-center">
            <h3>{'You have not created  any maps! please create a Map'}</h3>
          </div>
        </div>}
        <ReactPaginate previousLabel={"previous"} nextLabel={"next"} breakLabel={< a href = "javascript:;" > ...</a>} breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={this.handlePageClick} containerClassName={"pagination"} subContainerClassName={"pages pagination"} activeClassName={"active"}/>
      </div>
    )
  }
}
