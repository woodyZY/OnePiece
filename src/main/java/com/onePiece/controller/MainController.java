package com.onePiece.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.onePiece.entity.Group;
import com.onePiece.entity.Pirate;
import com.onePiece.entity.PirateDetails;
import com.onePiece.md5.MD5Util;
import com.onePiece.service.GroupService;
import com.onePiece.service.PirateService;

@Controller
public class MainController {
	
	@Resource(name="groupService")
	private GroupService groupService;
	
	@Resource(name="pirateService")
	private PirateService pirateService;
	
	@RequestMapping("/mainPage")
	public String mainPage(){
		return "mainPage";
	}
	
	@RequestMapping("/login")
	@ResponseBody
	public Map<String, Object> login(String password,HttpSession session,Model model){
		Map<String, Object>requestMap = new HashMap<String, Object>();
		String pwd = "75645781";
		pwd = MD5Util.MD5(pwd);
		pwd= pwd.toUpperCase();
		password  = password.toUpperCase();
		if(password.equals(pwd)){
			session.setAttribute("isLogin", true);
			requestMap.put("isLogin", "true");
		}
		else{
			session.setAttribute("isLogin", false);
			requestMap.put("isLogin", "false");
		}
		return requestMap;
	}
	
	@RequestMapping("/loginOut")
	public String loginOut(HttpSession session){
		session.removeAttribute("isLogin");
		return "mainPage";
	}
	
	@RequestMapping("/adPage")
	public String adPage(){
		return "adPage";
	}
	
	@RequestMapping("/show")
	public String show(Model model){
		List<Group>groups = groupService.queryGroups(0, 1000);
		List<String>groupsList = new ArrayList<String>();
		for(Group group:groups){
			groupsList.add(group.getGroupName());
		}
		JSONArray groupsJson = JSONArray.fromObject(groupsList);
		model.addAttribute("groups", groupsJson);
		return "showAdminPage";
	}
	
	@RequestMapping("/overview")
	public String overview(){		
		return "overview";
	}
	
	@RequestMapping("search")
	public String search(String search,Model model){
		String str = search;
        try {
        	//由于jsp页面使用get方法传递搜索框的值，后台接受会出现乱码
        	//用以下方法处理
//			str = new String(search.getBytes("ISO8859-1"),"UTF-8");
		    //先检测海贼团名，调用groupSerach(str)
			List<Group>searchGroups = groupService.searchGroups(str);
			if(searchGroups.size()==1){
				List<String>pirateNameList = new ArrayList<String>();
				for(Pirate pirate:searchGroups.get(0).getPirates()){
					pirateNameList.add(pirate.getPirateName());
				}
				JSONArray piratesJson = JSONArray.fromObject(pirateNameList);
				model.addAttribute("groupName", searchGroups.get(0).getGroupName());
				model.addAttribute("pirateNameList", piratesJson);
				return "showGroup";
			}
			else if(searchGroups.size()>1){
				List<String>groupNameList = new ArrayList<String>();
				for(Group group:searchGroups){
					groupNameList.add(group.getGroupName());
				}
				JSONArray groupsJson = JSONArray.fromObject(groupNameList);
				model.addAttribute("groups", groupsJson);
				model.addAttribute("forSearch", true);
				return "showGroups";
			}
			//再检测海贼名，调用pirateSearch(str)
			List<Pirate>searchPirates = pirateService.searchPirates(str);
			if(searchPirates.size()==1){
				//手动提取信息到Map里，再转JSON
				Pirate pirate = searchPirates.get(0);
				Map<String, Object>pirateMap = new HashMap<String, Object>();
				pirateMap.put("pirateName", pirate.getPirateName());
				pirateMap.put("groupName", pirate.getGroup().getGroupName());
				pirateMap.put("position", pirate.getPosition());
				pirateMap.put("pirateImg", pirate.getPirateImgSrc());
				pirateMap.put("bounty", pirate.getBounty());
				pirateMap.put("weapon", pirate.getDetails().getWeapon());
				pirateMap.put("skills", pirate.getDetails().getSkillsSet());
				pirateMap.put("story", pirate.getDetails().getStory());
//				JsonConfig config = new JsonConfig();
//				config.setExcludes(new String[]{"group","details"});
				JSONObject pirateInfo = JSONObject.fromObject(pirateMap);
				model.addAttribute("pirate", pirateInfo);
				return "showPirate";
			}
			else if(searchPirates.size()>1){
				List<String>pirateNameList = new ArrayList<String>();
				for(Pirate pirate:searchPirates){
					pirateNameList.add(pirate.getPirateName());
				}
				//转JSON传到前台
				JSON piratesJson = JSONArray.fromObject(pirateNameList);
				model.addAttribute("pirates", piratesJson);
				return "showPirates";
			}
			
				//最后检测海贼信息，调用detailSearch(str),暂时没用Blob的模糊查询
				//暂时选择循环遍历每一条数据来查询，效率低
				List<Pirate>pirateList = pirateService.queryPirates();
				List<Pirate> searchPirateList = new ArrayList<Pirate>();
				Iterator<Pirate>it = pirateList.iterator();
				while(it.hasNext()){
					Pirate pirate = it.next();
					//获取海贼信息
					PirateDetails pd = pirate.getDetails();
					//检测story中是否包含搜索的字符串
					if(pd.getStory().contains(str)){
						searchPirateList.add(pirate);
						continue;
					}
					//检测weapon中是否包含搜索的字符串
					else if(pd.getWeapon().contains(str)){
						searchPirateList.add(pirate);
						continue;
					}
					//检测职位中是否包含搜索的字符串
					else if(pirate.getPosition().contains(str)){
						searchPirateList.add(pirate);
					}
					//将set集合转字符串，再判断包含关系
					else{
						String[]skillsSet = pd.getSkillsSet();
						String str2 = StringUtils.join(skillsSet, ",");
						//检测技能中是否包含搜索字符串
						if(str2.contains(str)){
							searchPirateList.add(pirate);
							continue;
						}
					}
				}
				if(searchPirateList.size()==1){
					//手动提取信息到Map里，再转JSON
					Pirate searchPirate = searchPirateList.get(0);
					Map<String, Object>pirateMap = new HashMap<String, Object>();
					pirateMap.put("pirateName", searchPirate.getPirateName());
					pirateMap.put("groupName", searchPirate.getGroup().getGroupName());
					pirateMap.put("position", searchPirate.getPosition());
					pirateMap.put("bounty", searchPirate.getBounty());
					pirateMap.put("weapon", searchPirate.getDetails().getWeapon());
					pirateMap.put("skills", searchPirate.getDetails().getSkillsSet());
					pirateMap.put("story", searchPirate.getDetails().getStory());
					//				JsonConfig config = new JsonConfig();
					//				config.setExcludes(new String[]{"group","details"});
					JSONObject pirateInfo = JSONObject.fromObject(pirateMap);
					model.addAttribute("pirate", pirateInfo);
					return "showPirate";
				}
				else if(searchPirateList.size()>1){
					List<String>pirateNameList = new ArrayList<String>();
					for(Pirate pirate:searchPirateList){
						pirateNameList.add(pirate.getPirateName());
					}
					//转JSON传到前台
					JSON piratesJson = JSONArray.fromObject(pirateNameList);
					model.addAttribute("pirates", piratesJson);
					return "showPirates";
				}
				else{
					return "searchForNothing";
				}
				
		  
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		//模糊搜索，匹配数据库中不同的数据，返回不同的controller
//		return new ModelAndView("redirect:/showPirate");
		
	}
	
	@RequestMapping("/addGroupPage")
	public String addGroupPage(){
		return "addGroup";
	} 
	@RequestMapping("/addPiratePage")
	public String addPiratePage(){
		return "addPirate";
	} 
	@RequestMapping("/addPirateDetailsPage")
	public String addPirateDetails(String pirateName,Model model){
		System.out.println(pirateName);
		try {
			//js一般编码是ISO8859-1，中文传值会乱码，所以在后台转码UTF-8
//			pirateName =  new String(pirateName.getBytes("ISO8859-1"),"UTF-8");
			//在tomcat的server.xml文件中，在Connector标签添加URIEncoding="utf-8"即可
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		model.addAttribute("pirateName", pirateName);
		return "addPirateDetailsPage";
	}
}
