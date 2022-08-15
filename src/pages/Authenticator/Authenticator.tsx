import { InputBox } from "../../components";
import { useState, useEffect } from "react";
import "./Authenticator.scss";
import { useAppDispatch, useAppSelector } from "../../redux/customReduxHooks";
import { auth } from "../../redux/features/authenticatorSlice";
import { useNavigate } from "react-router-dom";

const Authenticator = () => {
    const dispatch = useAppDispatch(),
        navigate = useNavigate(),
        user = useAppSelector(state => state.user),
        [state, setState] = useState<formState>({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            mobile: "",
            device_type: "0"
        }),
        [showSignIn, setShowSignIn] = useState<boolean>(false),
        { first_name, last_name, email, password, mobile } = state;

    let formFields = [
        {
            name: 'first_name',
            value: first_name,
            label: 'First Name',
        },
        {
            name: 'last_name',
            value: last_name,
            label: 'Last Name',
        },
        {
            name: 'email',
            value: email,
            label: 'Email',
        }, {
            name: 'mobile',
            value: mobile,
            label: 'Contact No.',
            type: 'number',
        },
        {
            name: 'password',
            value: password,
            label: 'Password',
        }
    ];

    if (showSignIn) {
        formFields = formFields.filter((input: any) => (input.name === 'email' || input.name === 'password'))
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    },
        handleSubmit = (e: any) => {
            e.preventDefault();
            showSignIn
                ? dispatch(auth({ purpose: 'login', obj: state }))
                : dispatch(auth({ purpose: 'register', obj: state }));
        };

    useEffect(() => {
        switch (user.status) {
            case 'succeeded': navigate('/games'); return;
            case 'failed': alert(user.data.message);
        }
    }, [navigate, user]);


    return (
        <div className="authenticator">
            {
                user.status === 'pending' && <div className="spinner">
                    <img src="spinner.gif" alt="" />
                </div>
            }
            <h1>
                {showSignIn ? "SignIn" : "SignUp"}
            </h1>
            <form onSubmit={handleSubmit} className="authenticator">
                {
                    formFields.map((inputData, i) => <InputBox key={`form-input-${i}`} {...inputData} handleChange={handleChange} required />)
                }
                <button>Submit</button>
            </form>
            {
                showSignIn ? <p>Don't have a account? <span onClick={() => setShowSignIn(false)}>SignUp</span> here.</p>
                    : <p>Already have an account? <span onClick={() => setShowSignIn(true)}>SignIn</span> here.</p>
            }
        </div>
    )
}

export default Authenticator