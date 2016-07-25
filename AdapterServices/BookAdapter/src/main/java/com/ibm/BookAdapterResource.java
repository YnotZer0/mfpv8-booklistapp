/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.ibm;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

/* Add org.apach.http*/
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Api(value = "Book Adapter Resource")
@Path("/services")
public class BookAdapterResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(BookAdapterResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;


    /*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/BookAdapter/services/list"
	 */

	@ApiOperation(value = "Get book list", notes = "Return book list")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "A constant string is returned") })
	@GET
	@Path("/list")
	@Produces(MediaType.TEXT_PLAIN)
	public String books() {
		System.out.println(">> in books() ...");
		logger.info(">> BookAdapterResource: books");
		String rsp = null;
		try {
			rsp =  getHttp("http://bladmin.mybluemix.net/v1/books");
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rsp;
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/BookAdapter/services/details/{id}"
	 */

	@ApiOperation(value = "Book Details by Id", notes = "Return the book detials, by Id")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Property value returned."),
			@ApiResponse(code = 404, message = "Property value not found.") })
	@GET
	@Path("/details/{id}")
	@Produces(MediaType.TEXT_PLAIN)
	public String getDetails(
			@ApiParam(value = "The name of the property to lookup", required = true) @PathParam("id") String id) {
		// Get the value of the property:
		System.out.println(">> in getDetails() ...");
		System.out.println(">> id :[" + id + "]");
		String rsp = null;
		try {
			rsp =  getHttp("http://bladmin.mybluemix.net/v1/book/" + id);
			System.out.println(">> rsp :"+rsp.toString());
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rsp;

	}

	private final String USER_AGENT = "Mozilla/5.0";
	public String getHttp(String url) throws ClientProtocolException, IOException{
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);
		// add request header
		request.addHeader("User-Agent", USER_AGENT);
		HttpResponse response = client.execute(request);
		System.out.println("Response Code : "
				+ response.getStatusLine().getStatusCode());

		BufferedReader rd = new BufferedReader(
				new InputStreamReader(response.getEntity().getContent()));
		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
			result.append(line);
		}
		return result.toString();
	}



}