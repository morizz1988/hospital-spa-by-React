import '../css/depart-list.css';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { guahao } from '../store/actions';
import scroll from 'iscroll';
import { $,$Ajax,$Param,$Next } from '../js/common'

let iScroll,iScroll2,origin;

@connect (
    state => {return { guahaoInf:state.guahaoInf } }
)
export default class extends React.Component{
    state = {
        shadeAct:false,
        chooseBigDepartName:'',
        bigDepart:[],
        smallDepart:[]
    }
    constructor(props){
        super(props)
        let type = props.match.params.type;
        if(type == "guahao"){
            origin = {
                bigUrl : "getdept",
                smallUrl : "getOutdept",
                toPath : "/guahao-by-time"
            }
        }else if(type == "chaxun"){
            origin = {
                bigUrl : "getDepartmentList",
                smallUrl : "getMenZhenList",
                toPath : "/doctor-list"
            }
        }
    }
    componentWillMount(){
        $Ajax(origin.bigUrl,{},(data)=>{
            this.setState({bigDepart:data.obj})
        })
    }
    componentDidMount(){
        iScroll = new scroll('.scroll-wrapper',{click:true})
    }
    componentDidUpdate(){
        if(this.state.shadeAct){
            iScroll2 = new scroll('#shade-ul-wrapper',{click:true})
        }
    }
    getSmallDepart(id,name){
        $Ajax(origin.smallUrl,{
            departmentId:id
        },(data)=>{
            this.setState({chooseBigDepartName:name,shadeAct:true,smallDepart:data.obj})
        })
    }
    closeShade(){
        this.setState({shadeAct:false})
    }
    toDoctorList(id){
        this.props.dispatch(guahao("departId",id))
        $Next();
        this.props.history.push({
            pathname: origin.toPath
        })
    }
    render() {
        let items = this.state.bigDepart.map((item,i)=>{
            return (
                <li key={item.departmentId} onClick={this.getSmallDepart.bind(this,item.departmentId,item.departmentName)}><span>{item.departmentName}</span></li>
            )
        }),
        items2 = this.state.smallDepart.map((item,i)=>{
            return (
                <li key={item.outDepId} onClick={this.toDoctorList.bind(this,item.outDepId)}><span>{item.outDepName}</span></li>
            )
        }),
        shadeList;
        if(this.state.shadeAct) {
            shadeList = (
                <div className="shade-wrapper">
                    <p id="close-shade" onClick={this.closeShade.bind(this)}/>
                    <div id="shade-list">
                        <h3>{this.state.chooseBigDepartName}</h3>
                        <div id="shade-ul-wrapper">
                            <ul className="scroll">
                                {items2}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
        return (<div className="body-wrap P20">      <div className="route-shade"></div>
            <div className="scroll-wrapper">
                <ul className="scroll">
                    {items}
                </ul>
            </div>

            <ReactCSSTransitionGroup transitionName="shade">
                {shadeList}
            </ReactCSSTransitionGroup>

            <footer>
                <p>{$.hosName}</p>
                <p>{$.copyright}</p>
            </footer>
        </div>)
    }
}