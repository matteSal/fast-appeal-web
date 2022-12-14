import React, { useCallback, useEffect, useRef, useState } from "react";
import { SpinnerCircular } from 'spinners-react';
import './styles/Home.css';
import axios from 'axios';
import { ABSENTS_TITLE, STUDENTS_TITLE, ENDPOINT, LOADING, INSERT_NAME, SCAN } from "../Utils.ts";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const webcamRef = useRef(null);
	const [userToAdd, setUserToAdd] = useState('');
	const [students, setStudents] = useState([]);
	const [absents, setAbsents] = useState([]);
	const [isStudentsLoading, setIsStudentsLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		hasChosen();
		getStudents();
	}, [])

	const hasChosen = () => {
		window.localStorage.getItem('classroom') == null ? navigate('/') : navigate('/home');
	}

	const takeScreenshot = async () => {
		setIsLoading(true);
		const imageSrc = webcamRef.current.getScreenshot();
		await axios.post(ENDPOINT + '/user/identify', {
			"encodedImage": imageSrc.substring(23),
			"classroom": window.localStorage.getItem('classroom')
		}).then(response => {
			setAbsents(response.data.param)
			// console.log(response.data)
		}).catch(e => {
			console.log(e)
		});
		setIsLoading(false);
	}

	const toggle = () => {
		document.querySelector('.add-user-panel').style.display == 'block' ? 
			document.querySelector('.add-user-panel').style.display = 'none' :
			document.querySelector('.add-user-panel').style.display = 'block';
	}

	const getStudents = async () => {
		setIsStudentsLoading(true);
		await axios.get(ENDPOINT + '/user/get?classroom=' + window.localStorage.getItem('classroom'))
		.then(response => { setStudents(response.data) })
		.catch(error => { console.log(error) })
		setIsStudentsLoading(false);
	}

	const deleteUser = async (id) => {
		setIsStudentsLoading(true);
		await axios.delete(ENDPOINT + '/user/delete?id=' + id)
		.then(response => {
			// console.log(response.data) 
		})
		.catch(error => { console.log(error) })
		getStudents()
	}

	const addUser = async () => {
		setIsStudentsLoading(true);
		const imageSrc = webcamRef.current.getScreenshot();
		await axios.post(ENDPOINT + '/user/add', {
			'name': userToAdd,
			'classroom': window.localStorage.getItem('classroom'),
			'encodedImage': imageSrc.substring(23)
		})
		.then(response => {
			// console.log(response.data) 
		})
		.catch(error => { console.log(error) })
		toggle();
		getStudents();
	}

	const handleUserToAdd = (e) => {
		setUserToAdd(e.target.value);
	}

	return (
		<div>
			<div className="containers">
				<div className='container'>
					<div className='top'>
						<h1>{ABSENTS_TITLE}</h1>
					</div>
					<div className="absents">
						{
							absents.map(absent => (
								absent.presence ? (
									<div className="user">
										<img src="user.png" className="img" />
										<div className="information">
											<h1 className="name">{absent.name}</h1>
											<h2 className="classroom">{window.localStorage.getItem('classroom')}</h2>
										</div>
									</div>
								):(
									<div className="user">
										<img src="useruseruser.png" className="img" />
										<div className="information">
											<h1 className="name">{absent.name}</h1>
											<h2 className="classroom">{window.localStorage.getItem('classroom')}</h2>
										</div>
									</div>
								)
							))
						}
					</div>
				</div>
				<div className='all-container'>
					<div className='all-top'>
						<h1>{STUDENTS_TITLE}</h1>
					</div>
					<div className="all-users">
						{ isStudentsLoading ? (
							<SpinnerCircular className='loading-students' size={40} color='#5fc96f' thickness={150} secondaryColor={'white'} />
						):(
							students.map(student => (
								<div className="all-user">
									<img src="user.png" className="all-img" />
									<div className="all-information">
										<h1 className="all-name">{student.name}</h1>
										<h2 className="all-classroom">{window.localStorage.getItem('classroom')}</h2>
									</div>
									<div onClick={(e) => deleteUser(student.id)}><ion-icon id="delete" name="trash-outline"></ion-icon></div>
								</div>
							))
						)}
					</div>
					<div onClick={(e) => toggle(e)} className="add-user">
						<ion-icon name="add-outline"></ion-icon>
					</div>
				</div>
				<div className="add-user-panel">
					<input type="text" className="user-name" name="user-name" onChange={(e) => handleUserToAdd(e)} value={userToAdd} placeholder={INSERT_NAME}/>
					<button onClick={(e) => addUser(e)} className="button-add">Aggungi</button>
				</div>
			</div>
			{ isLoading ? (
				<div>
					<SpinnerCircular className='loading-login' size={40} color='#5fc96f' thickness={150} secondaryColor={'white'} />
					<div className="webcam-shadow"></div>
					<button className="button-clicked">{LOADING}</button>
				</div>
			):(
				<button className="button" onClick={(e) => takeScreenshot(e)}>{SCAN}</button>
			)}
			<Webcam
				className="webcam"
				muted={true}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
			/>
		</div>
	)
}