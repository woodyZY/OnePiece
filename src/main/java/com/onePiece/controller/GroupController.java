package com.onePiece.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javassist.expr.NewArray;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import com.onePiece.entity.Group;
import com.onePiece.entity.Pirate;
import com.onePiece.service.GroupService;
import com.onePiece.service.PirateService;

@Controller
public class GroupController {
	@Resource(name="groupService")
	private GroupService groupService;
	@Resource(name="pirateService")
	private PirateService pirateService;
	
	@RequestMapping("/addGroup")
	@ResponseBody
	public Map<String, Object> addGroup(HttpServletRequest request,Group group,String groupName,String[] positionArray,String number,MultipartFile groupImg,String[] pirateArray)throws IllegalStateException, IOException{
		Map<String, Object>requestMap = new HashMap<String, Object>();
		group.setGroupName(groupName);
//		group.setNumber(Integer.parseInt(number));
		Set<Pirate>piratesSet = new HashSet<Pirate>();
		Set<Group>groupsSet = new HashSet<Group>();
		//创建保留海贼名字对应下标的顺序Map
		Map<String, Integer> orderMap = new HashMap<String, Integer>();
		try {
			int i = 0;
			for(String x : pirateArray){
				//依照前台post传递的值，查询对应pirate对象，并添加进set集合
				Pirate pirateTest = pirateService.queryPirate(x);
				piratesSet.add(pirateTest);
				Group group2 = pirateTest.getGroup();
				groupsSet.add((Group) group2.clone());
				//保存数组中每个名字对应的下标，因为Set是无序的
				orderMap.put(x, i);
				i++;
			}
			group.setPirates(piratesSet);
			group.setNumber(piratesSet.size());
			
			//下载上传的图片，并保存路径
			InputStream in  = null;
			OutputStream out = null;
			String url = this.getClass().getClassLoader().getResource("/").getPath();
			url = url.split("WEB-INF")[0];
			String src = url+"upload/group/"+groupName+".jpg";
			try {
				File targetFile = new File(src);
				in = groupImg.getInputStream();
				out = new BufferedOutputStream(new FileOutputStream(targetFile), 16*1024);
				byte[] buffer = new byte[16*1024];
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
			group.setGroupImgSrc(src);
			
			groupService.addGroup(group);
			Iterator<Pirate>pirateIterator = piratesSet.iterator();
			int testNumber = 0;
			while(pirateIterator.hasNext()){
				Pirate pirate_temp = pirateIterator.next();
				//船员更改海贼团时应该先对原海贼团执行setNumber()方法，更新数量
				Group testGroup = pirate_temp.getGroup();
				pirate_temp.setGroup(group);
				if(testGroup != null){
					testNumber = testGroup.getPirates().size()-1;
					testGroup.setNumber(testNumber);
					groupService.updateGroup(testGroup);
					
				}
				//由于set是无序的，先根据名字找到序号对应的职位，再存储
				int j = orderMap.get(pirate_temp.getPirateName());
				pirate_temp.setPosition(positionArray[j]);
				pirateService.updatePirate(pirate_temp);
				i++;
	
				if(testNumber==0){
                    groupService.deleteGroup(testGroup.getGroupName());						
				}
			}
			//如果没问题就返回true
			requestMap.put("bool", "true");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			//捕获异常手动回滚
			groupService.deleteGroup(groupName);
			for(Group g:groupsSet){
				groupService.updateGroup(g);
			}
			throw new RuntimeException();
		}
		return requestMap;
	}
	
	@RequestMapping("/deleteGroup")
	public String deleteGroup(String groupName,String admin){
        if("true".equals(admin)){
        	//解散海贼团，先将所有成员的海贼团变成null
        	Group group = groupService.queryGroup(groupName);
        	Set<Pirate>pirateList = group.getPirates();
        	Set<Pirate>pirateList1 = null;

        	for(Pirate p:pirateList){
        		pirateService.setGroupNull(p.getPirateName());
        	}
            group.setPirates(pirateList1);
        	groupService.updateGroup(group);
        	groupService.deleteGroup(groupName);
        	return "redirect:/show";
        }
		return "success";
	}
	
	@RequestMapping("/updateGroup")
	public String updateGroup(Group group){
		groupService.updateGroup(group);
		return "success";
	}
	
	@RequestMapping("/showGroup")
	public String showGroup(String groupName,Model model,String text){
		//test结果发现缺陷：船员更改海贼团，原来海贼团的人数没有相应改变
		//船员更改海贼团的时候，应该查询相应的原海贼团，然后重新调用setNumber()方法更新人数
//		groupName = "草帽海贼团";	
	    //text的值是overview页面传过来的
		//这个方法主要处理overview页面的世界政府、海军、革命军的显示
		if(text != null){
			groupName = text;
		}
		//如果text为null
		Group group = groupService.queryGroup(groupName);
//        Set<Pirate> pirateSet = group.getPirates();
//        Iterator<Pirate>iterator = pirateSet.iterator();
//        while(iterator.hasNext()){
//        	Pirate pirateTest = iterator.next();
//        	System.out.println(pirateTest.getPirateName());
//        }
		List<String>pirateNameList = new ArrayList<String>();
		for(Pirate pirate:group.getPirates()){
			pirateNameList.add(pirate.getPirateName());
		}
		JSONArray pirateNameListJson = JSONArray.fromObject(pirateNameList);
		model.addAttribute("groupName", groupName);
		model.addAttribute("pirateNameList",pirateNameListJson);
		return "showGroup";
	}
	
	@RequestMapping("/showGroups")
	public String showGroups(Model model,String text){
		//从0开始，最大取10条
		List<Group> groups = groupService.queryGroups(0,10);
		for(Group group:groups){
			String name = group.getGroupName();
			if(name=="世界政府"||
			   name=="海军"||
			   name=="革命军"){
				groups.remove(group);
			}
		}
		//因为前台只需要显示名字，无需过多包含信息，所以提取出海贼团名字
		//不然转JSON时，因为对象的包含关系，比如海贼团包含海贼，而海贼又有海贼团属性
		//这样无限循环，JSON的拆解不会停止，导致死循环错误
		//也可以用去除级联的方式在转JSON时去除对象的级联关系
//		JsonConfig config = new JsonConfig();
//		config.setExcludes(new String[]{"Pirates"});
//		String groupsJson = JSONArray.fromObject(groups,config).toString();
		
		List<String>groupNameList = new ArrayList<String>();
		for(Group group:groups){
			groupNameList.add(group.getGroupName());
		}
		JSONArray groupsJson = JSONArray.fromObject(groupNameList);
		model.addAttribute("groups", groupsJson);
		//与模糊搜索的加载区别开来
		model.addAttribute("forSearch", false);
		return "showGroups";
	}
	
	//实现下拉加载，后台响应前台ajax请求，返回海贼团数据
	@RequestMapping("/loadGroups")
	@ResponseBody
	public Map<String , Object>loadGroups(Integer min,Integer max){
		Map<String, Object> requestMap = new HashMap<String, Object>();
		try {
			List<Group>groupsList = groupService.queryGroups(min, max);
			List<String>groupNameList = new ArrayList<String>(); 
			for(Group group:groupsList){
				groupNameList.add(group.getGroupName());
			}
			for(int i=0;i<groupNameList.size();i++){
				requestMap.put("groupsList["+i+"]", groupNameList.get(i));
			}
			requestMap.put("length", groupNameList.size());
			return requestMap;
		} catch (Exception e) {
			// TODO: handle exception
			requestMap.put("error", e);
			return requestMap;
		}
		
	}
	
	@RequestMapping("/isGroupExist")
	@ResponseBody
	public Map<String, Object> isGroupExist(String groupName){
		Map<String , Object> requestMap = new HashMap<String, Object>();
		try {
			groupName = URLDecoder.decode(groupName, "UTF-8");
			//如果返回结果为null，说明数据库中不存在此海贼团
			if(groupService.queryGroup(groupName)==null){
				//不存在就返回false
				requestMap.put("bool", "false");
				return requestMap;
			}
			else {
				//以下注释代码，测试了海贼维护了与海贼团关系（一对多双向）
				//也维护了与海贼信息的关系（一对一双向）
//				Group group = groupService.queryGroup(groupName);
//				Set<Pirate> pirateSet = new HashSet<Pirate>();
//				pirateSet = group.getPirates();
//				Iterator<Pirate> iterator = pirateSet.iterator();
//				while(iterator.hasNext()){
//					Pirate pirate = iterator.next();
//					System.out.println(pirate.getPirateName());
//					String[] skillsArray = pirate.getDetails().getSkillsSet();
//					for(String skill : skillsArray){
//						System.out.println(skill);
//					}
//					
//				}
				requestMap.put("bool", "true");
				return requestMap;
			}
		} catch (Exception e) {
			// TODO: handle exception
			requestMap.put("bool", "false");
			return requestMap;
		}
	}

	@RequestMapping("/showGroupsForInit")
	@ResponseBody
	public Map<String, Object> showGroupsForInit(){
		Map<String, Object>requestMap = new  HashMap<String, Object>();
		List<Group> groupList =new ArrayList<Group>();
		//获取所有group
		int localLength = 1;
		int maxLength = 0;
		int count = 0;
		
		try {
			while(localLength>maxLength){
				maxLength = localLength;
				groupList.addAll(groupService.queryGroups(count,count+100));
				count +=100;
				localLength = groupList.size();
			}
			List<String>groupNameList = new ArrayList<String>();
			for(Group group:groupList){
				groupNameList.add(group.getGroupName());
			}
			requestMap.put("groups", groupNameList);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return requestMap;
	}

    @RequestMapping("/modifyGroup")
	public String modifyGroup(String groupName,Model model){
		Group group = groupService.queryGroup(groupName);
		Set<Pirate>pirateSet = group.getPirates();
		List<String>pirateNameList = new ArrayList<String>();
		List<String>positionList = new ArrayList<String>();
		List<String>captain = new ArrayList<String>();
		for(Pirate p:pirateSet){
			if("船长".equals(p.getPosition())){
				captain.add(p.getPirateName());
			}
			else{
				pirateNameList.add(p.getPirateName());
				positionList.add(p.getPosition());
			}
		}
		JSONArray pirateNameListJson = JSONArray.fromObject(pirateNameList);
		JSONArray positionListJson = JSONArray.fromObject(positionList);
		JSONArray captainJson = JSONArray.fromObject(captain);
		model.addAttribute("pirateName", pirateNameListJson);
		model.addAttribute("position", positionListJson);
		model.addAttribute("captain", captainJson);
		return "modifyGroup";
	}
}
