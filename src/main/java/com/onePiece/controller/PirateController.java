package com.onePiece.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.tagext.FunctionInfo;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonMapFormatVisitor;
import com.onePiece.entity.Group;
import com.onePiece.entity.Pirate;
import com.onePiece.entity.PirateDetails;
import com.onePiece.service.GroupService;
import com.onePiece.service.PirateDetailsService;
import com.onePiece.service.PirateService;

@Controller
public class PirateController {

	@Resource(name="pirateService")
	private PirateService pirateService;
	@Resource(name="groupService")
	private GroupService groupService;
	@Resource(name="pdService")
	private PirateDetailsService pirateDetailsService;
	
	@RequestMapping("/queryPirate")
	@ResponseBody
	public Map<String, Object>queryPirate(String pirateName){
		try {
			pirateName = URLDecoder.decode(pirateName,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Pirate pirate = pirateService.queryPirate(pirateName);
		//由于存在双向对应关系，转JSON时会死循环 
		//所以手动提取信息到Map里，再转JSON
		Map<String, Object>pirateMap = new HashMap<String, Object>();
		pirateMap.put("pirateName", pirate.getPirateName());
		pirateMap.put("groupName", pirate.getGroup().getGroupName());
		pirateMap.put("position", pirate.getPosition());
		pirateMap.put("pirateImgSrc", pirate.getPirateImgSrc());
		pirateMap.put("bounty", pirate.getBounty());
		pirateMap.put("weapon", pirate.getDetails().getWeapon());
		pirateMap.put("skills", pirate.getDetails().getSkillsSet());
		pirateMap.put("story", pirate.getDetails().getStory());

		return pirateMap; 
	}
	
	@RequestMapping("/addPirate")
	@ResponseBody
	public Map<String, Object> addPirate(HttpServletRequest request,Pirate pirate,String pirateName,String groupName,String position,Integer bounty,MultipartFile pirateImg){
		Map<String, Object> requestMap = new HashMap<String, Object>();
		try {
//			System.out.println(pirateName);
			pirate.setPirateName(pirateName);
			Group group_temp = new Group();
			//新增海贼时填选了海贼团名
			if(!"".equals(groupName)){
				group_temp = groupService.queryGroup(groupName);
				pirate.setGroup(group_temp);
				Set<Pirate>pirateSet = group_temp.getPirates();
				pirateSet.add(pirate);
				pirate.getGroup().setPirates(pirateSet);
				pirate.getGroup().setNumber(pirateSet.size());
//				group_temp.setPirates(pirateSet);
//				group_temp.setNumber(pirateSet.size());
			}
			else{
				pirate.setGroup(null);
			}
			//获取保存的海贼图片路径并存进数据库
			String src = getImgSrc(request, pirateName, pirateImg);
			pirate.setPirateImgSrc(src);
            pirate.setPosition(position);
			pirate.setBounty(bounty);
			PirateDetails pirateDetails = new PirateDetails();
			pirateDetails = null;
			pirate.setDetails(pirateDetails);
			if(!"".equals(groupName)){
				groupService.updateGroup(group_temp);
			}
			pirateService.addPirate(pirate);
			requestMap.put("bool", "true");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			requestMap.put("bool", "false");
		}
		return requestMap;
	}
	
	@RequestMapping("/addPirateDetails")
	@ResponseBody
	public Map<String, Object> addPirateDetails(String pirateName,String story,String weapon,String[] skillsArray){
		    Map<String, Object>requestMap = new HashMap<String, Object>();
		try {
			if(pirateName==null){
				requestMap.put("bool", "true");
				return requestMap;
			}
			Pirate pirate = pirateService.queryPirate(pirateName);
			PirateDetails pirateDetails = new PirateDetails();
			//持久化海贼详细信息
			pirateDetails.setStory(story);
			pirateDetails.setWeapon(weapon);
			pirateDetails.setSkillsSet(skillsArray);
			pirateDetailsService.addPirateDetails(pirateDetails);
			//更新海贼
			pirate.setDetails(pirateDetails);
			pirateService.updatePirate(pirate);
			requestMap.put("bool", "true");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			requestMap.put("bool", "false");
		}
		System.out.println(pirateService.queryPirate(pirateName).getDetails());
		return requestMap;
	}
	
	@RequestMapping("/deletePirate")
	@ResponseBody
	public String deletePirate(String pirateName){
		Pirate pirate = pirateService.queryPirate(pirateName);
		Group group = pirate.getGroup();
		PirateDetails pd = pirate.getDetails();
		pirateService.deletePirate(pirateName);
		group.setNumber(group.getPirates().size());
		groupService.updateGroup(group);
		pirateDetailsService.deletePirateDetails(pd.getId());
		return "success";
	}
	
	
	@RequestMapping("/updatePirate")
	public String updatePirate(Pirate pirate){
		pirateService.updatePirate(pirate);
		return "success";
	}
	
	@RequestMapping("/updatePirateImg")
	@ResponseBody
	public Map<String, Object>updatePirateImg(String String1,HttpServletRequest request,MultipartFile pirateImg,String pirateName1) throws IOException{
		Map<String, Object>requestMap = new HashMap<String, Object>();
		Pirate pirate = pirateService.queryPirate(pirateName1);
		String src = getImgSrc(request, pirateName1, pirateImg);
		requestMap.put("pirateImgSrc", src);
		//保存新路径
		pirate.setPirateImgSrc(src);
		pirateService.updatePirate(pirate);
		return requestMap;
	}
	
	public String getImgSrc(HttpServletRequest request,String pirateName1,MultipartFile pirateImg) throws IOException{
		
		//创建输入输出流
		InputStream in  = null;
		OutputStream out = null;
		//获取项目绝对路径用于写入文件
		String dir = this.getClass().getClassLoader().getResource("").getPath();
		dir = dir.split("WEB-INF")[0];
		dir = dir.substring(1);
		Date date = new Date();
		dir= dir+"upload/pirate/"+date.getTime()+pirateName1+".jpg";
	    //获取相对路径用于读取文件
		String src = request.getContextPath();
		src = src+"/upload/pirate/"+date.getTime()+pirateName1+".jpg";
		//下载上传的图片，并保存路径
		    //删除原文件
		File oldFile = new File(dir);
		if(oldFile.exists()){
			oldFile.delete();
		}
		try {
			File targetFile = new File(dir);
			in = pirateImg.getInputStream();
			out = new BufferedOutputStream(new FileOutputStream(targetFile), 16*1024);
			byte[] buffer = new byte[16*1024];
			//保存新文件
			while(in.read(buffer)>0){
				out.write(buffer);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
			if(null!=in){
				in.close();
			}
			if(null!=out){
				out.close();
			}
		}
		return src;
	}
	
	@RequestMapping("/modifyPirate")
	@ResponseBody
	public Map<String, Object>modifyPirate(String String1,String String2,String pirateName1) throws IOException{
		Map<String, Object>requestMap = new HashMap<String, Object>();
		Map<String, Integer>detailsMap = new HashMap<String, Integer>();
		Pirate pirate = pirateService.queryPirate(pirateName1);
		PirateDetails pDetails = pirate.getDetails();
		detailsMap.put("groupName", 1);
		detailsMap.put("position", 2);
		detailsMap.put("bounty", 3);
		detailsMap.put("skills", 4);
		detailsMap.put("story", 5);
		switch (detailsMap.get(String1)) {
		//如果String1是groupName,则更改海贼团
		case 1:
			Group group1 = pirate.getGroup();
			
			group1.setNumber(group1.getPirates().size()-1);
			groupService.updateGroup(group1);
			Group group2 = groupService.queryGroup(String2);
			pirate.setGroup(group2);
			pirateService.updatePirate(pirate);
			if(group1.getPirates().size()==0){
				groupService.deleteGroup(group1.getGroupName());
			}
			group2.setNumber(group2.getPirates().size());
			groupService.updateGroup(group2);
			break;
		//如果String1是position,则更改职位
		case 2:
			pirate.setPosition(String2);
			break;
		//如果String1是bounty,则更改赏金	
		case 3:
			pirate.setBounty(Integer.parseInt(String2));
			break;
	    //如果String1是skills,则更改技能
		case 4:
			
			if(String2.contains(",")){
				String[] skillsSet1 = String2.split(",");			
				pDetails.setSkillsSet(skillsSet1);
			}
			else if(String2.contains("，")){
				String[] skillsSet2 = String2.split("，");
				pDetails.setSkillsSet(skillsSet2);
			}
			pirateDetailsService.updatePirateDetails(pDetails);
			break;
		//如果String1是story,则更改故事
		case 5:
			pDetails.setStory(String2);
			pirateDetailsService.updatePirateDetails(pDetails);
			break;
		default:
			break;
		}
		pirateService.updatePirate(pirate);
		return requestMap;
	}
	
	@RequestMapping("/showPirate")
	public String showPirate(String pirateName,Model model){
		try {
			pirateName = URLDecoder.decode(pirateName,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Pirate pirate = pirateService.queryPirate(pirateName);
		//由于存在双向对应关系，转JSON时会死循环 
		//所以手动提取信息到Map里，再转JSON
		Map<String, Object>pirateMap = new HashMap<String, Object>();
		pirateMap.put("pirateName", pirate.getPirateName());
		String groupName = null;
		try {
			groupName = pirate.getGroup().getGroupName();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			groupName = "无";
			e.printStackTrace();
		}
		pirateMap.put("groupName", groupName);
		pirateMap.put("position", pirate.getPosition());
		pirateMap.put("pirateImg", pirate.getPirateImgSrc());
		pirateMap.put("bounty", pirate.getBounty());
		pirateMap.put("weapon", pirate.getDetails().getWeapon());
		pirateMap.put("skills", pirate.getDetails().getSkillsSet());
		pirateMap.put("story", pirate.getDetails().getStory());
//		JsonConfig config = new JsonConfig();
//		config.setExcludes(new String[]{"group","details"});
		JSONObject pirateInfo = JSONObject.fromObject(pirateMap);
		model.addAttribute("pirate", pirateInfo);
		return "showPirate";
	}
	
	@RequestMapping("/showPirates")
	public String showPirates(Model model){
		List<Pirate> pirates = pirateService.queryPirates();
		List<String>pirateNameList = new ArrayList<String>();
		for(Pirate pirate:pirates){
			pirateNameList.add(pirate.getPirateName());
		}
		//转JSON传到前台
		JSON piratesJson = JSONArray.fromObject(pirateNameList);
		model.addAttribute("pirates", piratesJson);
		return "showPirates";
	}
	
	@RequestMapping("/showPiratesForInit")
	@ResponseBody
    public Map<String, Object>showPiratesForInit(String groupName){
    	Map<String, Object>requestMap = new HashMap<String, Object>();
    	try {
    		Group group = groupService.queryGroup(groupName);
			Set<Pirate>pirateList = group.getPirates();
			List<String>pirateNameList = new ArrayList<String>();
			for(Pirate pirate:pirateList){
				pirateNameList.add(pirate.getPirateName());
			}
			requestMap.put("pirates", pirateNameList);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e);
		}
    	return requestMap;
    }
	
	@RequestMapping("/isPirateExist")
	@ResponseBody
	public Map<String, Object> isPirateExist(String pirateName){
		Map<String , Object> requestMap = new HashMap<String, Object>();
		try {
			//如果数据库里不存在相关记录会返回null
			if(pirateService.queryPirate(pirateName)==null){
				//如果返回null，表示海贼不存在
				//返回false
				requestMap.put("bool", "false");
				return requestMap;
			}
			else {
				requestMap.put("bool", "true");
				return requestMap;
			}
		} catch (Exception e) {
			// TODO: handle exception
			requestMap.put("bool", "false");
			return requestMap;
		}
	}
}
