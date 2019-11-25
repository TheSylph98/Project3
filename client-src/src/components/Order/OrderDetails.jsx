import React, { Component } from 'react';
import './stylesheet/style.scss';
import { getOrderDetails, cancelOrder } from '../../actions/order.action'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import SwappingSquaresSpinner from '../common/SwappingSquaresSpinner.jsx'

class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderCode: this.props.match.params.id,
            orderData: {},
            cancelTriggered: false,
            isSucc: false,
            isError: false,
        }
	}
    
    async componentDidMount(){
        await this.props.getOrderDetails(this.state.orderCode);
    }

    onTrigger(){
        let trig = this.state.cancelTriggered;
        this.setState({
            cancelTriggered: !trig,
        })
    }

    onConfirm(){
        this.setState({
            ...this.state,
            isSucc: false,
        })
    }

    onCancel(){
        this.setState({
            ...this.state,
            isError: false,
        })
    }

    async onCancelOrder(orderCode, status){
        await this.props.cancelOrder(orderCode, status);
        if (status === "Confirmed"){
            this.props.orders.order.status = "Canceled";
            this.setState({
                ...this.state,
                cancelTriggered: false,
                isSucc: true, 
            })
        } else {
            this.setState({
                ...this.state,
                cancelTriggered: false,
                isError: true,
            })
        }
    }

    render() {
        const { order, loading } = this.props.orders;
        let orderData = (loading) || (order === null) ? (
            <SwappingSquaresSpinner/>
        ) : (
            order
        );

        let profileData = (loading) || (order === null) ? (
            <SwappingSquaresSpinner/>
        ) : (
            order.profileData
        );

        let cart = (loading) || (order === null) ? (
            <SwappingSquaresSpinner/>
        ) : (
            order.cart
        );

        let payment = null;
        switch (orderData.checkOutType){
            case 1:
                payment = "Chuyển khoản trực tiếp";
                break
            case 2:
                payment = "Thanh toán qua thẻ ngân hàng";
                break
            case 3:
                payment = "COD (Nhận tiền khi giao hàng)";
                break
            default:
                payment = "";
        }

        let address = (loading) || (order === null) ? (
            <SwappingSquaresSpinner/>
        ) : (
            String(orderData.profileData.details + ', ' + orderData.profileData.ward + ', ' + orderData.profileData.district + ', ' +orderData.profileData.province)
        );

        let CartData = (loading) || (order === null) ? (
            <SwappingSquaresSpinner/>
        ) : (
            orderData.cart.addedItems.map((item, index) => {
                return (
                    <tr>
                        <td className="text-center">
                            <div className="avatar">
                                <img className="img-avatar" src={item.imgUrl} alt="random img"/>
                            </div>
                        </td>
                        <td>
                            <div>{item.title}</div>
                        </td>
                        <td className="text-center">
                            <div>{item.author}</div>
                        </td>
                        <td className="text-center">
                            <div className="clearfix">
                                <div className="text-center">
                                    <strong>{item.quantity}</strong>
                                </div>
                            </div>
                        </td>
                        <td className="text-center">
                            <div>{item.price}</div>
                        </td>
                        <td className="text-center">
                            <strong>{item.price * item.quantity}</strong>
                        </td>
                    </tr>
                );
            })
        )

        let alertSucc= (!this.state.isSucc) ? (
            <></>
        ) : (
            <SweetAlert success title="Thành công!" onConfirm={()=>{this.onConfirm()}}>
            </SweetAlert>
        );

        let alertFailed= (!this.state.isError) ? (
            <></>
        ) : (
            <SweetAlert title="Không thể xóa đơn này!" onConfirm={()=>{this.onCancel()}}>
            </SweetAlert>
        );

        let alertComp = (!this.state.cancelTriggered) ? (
            <></>
        ) : (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Có!"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="default"
                title="Bạn chắc chắn muốn hủy đơn này không?"
                onConfirm={()=>{this.onCancelOrder(this.state.orderCode, orderData.status)}}
                onCancel={()=>{this.onTrigger()}}
                >
            </SweetAlert>
        );
        if ((loading) || (order === null)){
            return(
                <SwappingSquaresSpinner/>
            );
        } else {
            return (
                <div className="container">
                <div style={{height: 20}}></div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <h3>Chi tiết đơn hàng</h3>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="text-center">
                                            <input
                                            type="button"
                                            id="btnUpdateInfoLender"
                                            className="btn btn-warning mx-auto text-uppercase"
                                            value="Hủy đơn hàng"
                                            onClick={() => this.onTrigger()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Họ và tên:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{profileData.fullName}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Email:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{profileData.email}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                     <h4 className="orderDetails">Số điện thoại:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{profileData.phone}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row"> 
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Hình thức thanh toán:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{payment}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Trạng thái:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{orderData.status}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Thời gian đặt hàng:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{orderData.orderDate}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Thời gian ship:</h4>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">{orderData.shipDate}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="">
                                                    <h4 className="orderDetails">Địa chỉ giao hàng:</h4>
                                                </div>
                                            </div>
                                        <div className="col-sm-6">
                                            <div className="">
                                                <h4 className="orderDetails">{address}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <table className="table table-responsive-sm table-hover table-outline mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="text-center">Ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th className="text-center">Tác giả</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-center">Đơn giá</th>
                                        <th className="text-center">Tổng giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CartData}
                                    <tr>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center">
                                            <div>Tổng phụ</div>
                                        </td>
                                        <td className="text-center">
                                            <strong>{cart.total}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center">
                                            <div>Phí ship</div>
                                        </td>
                                        <td className="text-center">
                                            <strong>{cart.shipping}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center"></td>
                                        <td></td>
                                        <td className="text-center">
                                            <h3>Tổng</h3>
                                        </td>
                                        <td className="text-center">
                                            <h3>{cart.grandTotal}</h3>
                                        </td>
                                    </tr>
                                 </tbody>
                            </table>
                        </div>
                    </div>
                    {alertComp}
                    {alertSucc}
                    {alertFailed}
                </div>
                </div>
                </div>   
            )
        }
    };
}


OrderDetails.propTypes = {
	orders: PropTypes.object.isRequired,
    getOrderDetails: PropTypes.func.isRequired,
    cancelOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	orders: state.orders,
});
  
const mapDispatchToProps = {
    getOrderDetails,
    cancelOrder,
};
  
export default connect(
	mapStateToProps,
	mapDispatchToProps,
  )(OrderDetails);
// export default Product;