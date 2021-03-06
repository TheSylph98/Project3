import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCities, getDistricts } from '../../utils/getVNdata';
import { updateProfile } from '../../actions/profile.action';
import TextInputAuth from '../../HOC/TextInputAuth';
// import Notification from '../../HOC/Snackbar';
import Notifications, { notify } from 'react-notify-toast';
const Cities = getCities();
class UpdateInfo extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired
  };
  toast = notify.createShowQueue();
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      phone: '',
      gender: '',
      province: '',
      district: '',
      ward: '',
      details: '',
      errors: {},
    };
  }
  componentDidMount() {
    const { gender, address, phone, email } = this.props.profile;
    const { province, district, ward, details } = address;

    this.setState({
      email,
      phone,
      gender,
      province,
      district,
      ward,
      details
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    if (e.target.name === "province"){
      this.setState({ 
        [e.target.name]: e.target.value,
        district: getDistricts(e.target.value)[0][0]
      });
    } else{
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      email,
      phone,
      gender,
      province,
      district,
      ward,
      details
    } = this.state;
    const newInfo = {
      email,
      phone,
      gender,
      province,
      district,
      ward,
      details
    };
    this.props.updateProfile(newInfo);
  }
  render() {
    
    const {
      email,
      phone,
      gender,
      province,
      district,
      ward,
      details,
      errors,
    } = this.state;

    console.log(province, district)

    return (
      <div className="accinfo-2">
        <Notifications options={{ zIndex: 200, top: '10px' }} />
        <form noValidate onSubmit={e => this.onSubmit(e)}>
          <div className="row mb-3">        
            <div className="row col-xl-12">
              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="txtFullName"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Họ và tên:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <input
                      type="text"
                      className="form-control"
                      id="txtFullName"
                      placeholder=""
                      disabled="disabled"
                      value={this.props.profile.fullName}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="txtPhone"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Điện thoại:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <TextInputAuth
                        id="phone"
                        name="phone"
                        className="form-control form-control-lg fs-13 px-3 rounded"
                        placeholder="Số điện thoại"
                        title="Phone"
                        type="tel"
                        onChange={e => this.onChange(e)}
                        value={phone}
                        error={errors.phone}
                        
                      />
                    </div>
                </div>
              </div>
            </div>

            <div className="row col-xl-12">
              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="slGender"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Giới tính:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <select
                      className="form-control"
                      id="slGender"
                      
                      value={gender}
                      name="gender"
                      onChange={e => this.onChange(e)}
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="cbCity"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Thành phố:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <select
                      className="form-control"
                      id="cbCity"
                      
                      name="province"
                      value={province}
                      onChange={e => this.onChange(e)}
                    >
                      {Cities.map((city, index) => {
                        return (
                          <option key={index} value={city[0]}>
                            {city[1]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row col-xl-12">
              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="cbDistrict"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Quận/Huyện:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <select
                      className="form-control"
                      id="cbDistrict"
                      
                      name="district"
                      value={district}
                      onChange={e => this.onChange(e)}
                    >
                      {province &&
                        getDistricts(province).map((dis, index) => {
                          return (
                            <option key={index} value={dis[0]}>
                              {dis[1]}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="txtPhone"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Phường/ Xã:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <TextInputAuth
                        id="ward"
                        name="ward"
                        className="form-control form-control-lg fs-13 px-3 rounded"
                        placeholder="Phường/Xã"
                        title="Ward"
                        type="text"
                        onChange={e => this.onChange(e)}
                        value={ward}
                        error={errors.ward}
                        
                      />
                    </div>
                </div>
              </div>
            </div>

            <div className="row col-xl-12">
              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="txtAddress"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Địa chỉ:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <TextInputAuth
                        id="details"
                        name="details"
                        className="form-control form-control-lg fs-13 px-3 rounded"
                        placeholder="Địa chỉ"
                        title="Details"
                        type="text"
                        onChange={e => this.onChange(e)}
                        value={details}
                        error={errors.details}
                        
                      />
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="form-group row">
                  <label
                    htmlFor="txtAddress"
                    className="col-sm-4 col-form-label text-sm-right"
                  >
                    Email:
                  </label>
                  <div className="col-xl-8 col-sm-7">
                    <TextInputAuth
                        id="email"
                        name="email"
                        className="form-control form-control-lg fs-13 px-3 rounded"
                        placeholder="Địa chỉ"
                        title="Email"
                        type="text"
                        onChange={e => this.onChange(e)}
                        value={email}
                        error={errors.email}
                        disabled="disabled"
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="text-center">
              <input
                type="submit"
                className="btn btn-warning mx-auto text-uppercase"
                value="CẬP NHẬT"
              />
            </div>
            <div style={{height: 30}}></div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user, errors: state.errors });

const mapDispatchToProps = { updateProfile };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateInfo);
