package com.example.cinemacileback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.cinemacileback.dto.UserDTO;
import com.example.cinemacileback.model.Role;
import com.example.cinemacileback.model.User;
import com.example.cinemacileback.service.UserService;



@CrossOrigin("*")
@RestController
@RequestMapping(value = "api/user")
public class UserController {
	
	@Autowired
	UserService userService;

	
	@RequestMapping(value = "/registration", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> createUser(@RequestBody User user) {
		//UserDTO userDTO = UserMapper.INSTANCE.entityToDTO(user);
		//UserDTO userDTO = new UserDTO();
		String responseToClient;
		if (userService.validateUser(user).equals("invalid")) {
			//userDTO.setUserInvalidInput("yes");
			responseToClient = "invalidInput";
		} else if (userService.findByUsername(user.getUsername()) != null
				|| userService.validateUser(user).equals("not unique")) {
			//userDTO.setUserAlreadyExist("yes");
			responseToClient = "emailOrUsernameAlreadyExist";
		} else {
			user.setRole(Role.USER);
			user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
			userService.save(user);
			responseToClient = "success";
		}
		return new ResponseEntity<String>(responseToClient, HttpStatus.OK);

	}
	
	
	
	@RequestMapping(value = "/getAllUsers", method = RequestMethod.GET)
	public ResponseEntity<List<UserDTO>> getAllUsers() {
		List<UserDTO> usersDTO = userService.findAllUsers();
		return new ResponseEntity<List<UserDTO>>(usersDTO, HttpStatus.OK);
	}
	

	
	@RequestMapping(value = "/getCurrentUser", method = RequestMethod.GET)
	public ResponseEntity<User> getCurrentUser() {
		User user = userService.getCurrentUser();
		// UserDTO userDTO = UserMapper.INSTANCE.entityToDTO(user);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
		if (userService.findOne(id) == null) {
			return new ResponseEntity<UserDTO>(HttpStatus.NOT_FOUND);
		}	
		User user = userService.findOne(id);
	
		return new ResponseEntity<UserDTO>(new UserDTO(user), HttpStatus.OK);
	}
	@RequestMapping(value = "/deactivateUser/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
		if (userService.findOne(id) == null) {
			return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
		}
		String response = userService.deactivateUser(id);
		//String response = String.valueOf(userService.delete(userService.findOne(id)));
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
}
