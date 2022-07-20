{
  "properties" : { },
  "id" : "3d896ae91e454ec2bd74e30023d1b881",
  "script" : null,
  "groupId" : "cbe08d51e1af46d085be077eda555766",
  "name" : "列表",
  "createTime" : 1658317155109,
  "updateTime" : null,
  "lock" : null,
  "createBy" : null,
  "updateBy" : null,
  "path" : "/list",
  "method" : "POST",
  "parameters" : [ ],
  "options" : [ {
    "name" : "permission",
    "value" : "data:testdemo:view",
    "description" : "允许拥有该权限的访问",
    "required" : false,
    "dataType" : "String",
    "type" : null,
    "defaultValue" : null,
    "validateType" : null,
    "error" : null,
    "expression" : null,
    "children" : null
  } ],
  "requestBody" : null,
  "headers" : [ ],
  "paths" : [ ],
  "responseBody" : null,
  "description" : null,
  "requestBodyDefinition" : null,
  "responseBodyDefinition" : null
}
================================
return db.page("""
    select id,desc_ribe,dict_type,type,remarks from sys_dict where 1=1
    ?{descRibe, and desc_ribe = #{descRibe} }
    ?{dictType, and dict_type = #{dictType} }
    ?{type, and type = #{type} }
    ?{remarks, and remarks = #{remarks} }
    and is_del = 0
""")