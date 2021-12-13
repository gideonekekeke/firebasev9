import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../Base";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

const RegistrationPage = () => {
	const [image, setImage] = useState("");
	const [avatar, setAvatar] = useState("");
	const [percent, setPercent] = useState("");

	const schema = yup.object().shape({
		userName: yup.string().required("this field is required"),
		email: yup.string().email().required("this field is required"),
		password: yup.string().required("this field is required"),
		confirm: yup.string().oneOf([yup.ref("password"), null]),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const imageUpload = async (e) => {
		const file = e.target.files[0];
		const save = URL.createObjectURL(file);
		setImage(save);

		const fileRef = ref(storage, "/myImage", +file.name);
		const storageRef = uploadBytesResumable(fileRef, file);

		storageRef.on(
			"state_changed",
			((snapshot) => {
				const counter = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				console.log(counter);
				setPercent(counter);
			},
			(err) => console.log(err.message),
			() => {
				getDownloadURL(storageRef.snapshot.ref).then((url) => {
					setAvatar(url);
					console.log(avatar);
				});
			}),
		);
	};

	const RegisterUser = handleSubmit(async (val) => {
		const { userName, email, password, confirm } = val;

		const newUser = await createUserWithEmailAndPassword(auth, email, password);

		if (newUser) {
			const user = collection(db, "allUsers");
			const userDoc = doc(user, newUser.user.uid);
			setDoc(userDoc, {
				email,
				password,
				userName,
				confirm,
				avatar,
				createdBy: newUser.user.uid,
			});
			reset();
		}
	});

	return (
		<Container>
			this is the registration page
			<br />
			<Card onSubmit={RegisterUser}>
				<ImagePreview src={image} />

				<Label htmlFor='pic'>Upload Image</Label>
				<InputImage onChange={imageUpload} type='file' id='pic' />
				<span>{errors.userName?.message}</span>
				<input {...register("userName")} placeholder='enter username' />
				<span>{errors.email?.message}</span>
				<input {...register("email")} placeholder='enter email' />
				<span>{errors.password?.message}</span>
				<input {...register("password")} placeholder='enter password' />
				<span>{errors.confirm?.message}</span>
				<input {...register("confirm")} placeholder='enter confirm password' />
				<button type='submit'>Submit</button>
			</Card>
		</Container>
	);
};

export default RegistrationPage;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
`;
const Card = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 200px;
	min-width: 200px;
	min-height: 400px;
	border: 1px solid silver;

	input {
		height: 40px;
		margin: 10px;
		width: 400px;
	}
	button {
		outline: none;
		border: 0;
		padding: 15px 30px;
		width: 300px;
		border-radius: 3px;
		background-color: #004080;
		color: white;
		margin: 10px 0;
		transition: all 350ms;
		transform: scale(1);
		:hover {
			transform: scale(0.97);
			cursor: pointer;
		}
	}

	span {
		color: red;
	}
`;
const ImagePreview = styled.img`
	height: 100px;
	width: 100px;
	background-color: silver;
	border-radius: 50%;
	object-fit: cover;
`;
const Label = styled.label`
	padding: 6px 20px;
	background-color: #004080;
	color: white;
	border-radius: 30px;
	margin: 10px 0;
	transition: all 350ms;
	transform: scale(1);
	:hover {
		transform: scale(0.97);
		cursor: pointer;
	}
`;
const InputImage = styled.input`
	display: none;
`;
