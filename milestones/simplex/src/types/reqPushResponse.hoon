|%
+$  request
  $:  status=@ud
      push=path
      msg=@t
      channel=@t
==
+$  path
  $:  current=@ud
      path=(list @t)
==
+$  response
  $:  res=@t
      push=path
      status=@ud
      channel=@t
      
==
