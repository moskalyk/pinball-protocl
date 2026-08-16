|%
+$  request
  $:  status=@ud
      push=path
      msg=@t
      channel=@t
      params=parameters
==
+$  path
  $:  current=@ud
      path=(list @t)
==
+$  response
  $:  msg=@t
      push=path
      status=@ud
      channel=@t
      params=parameters
==
+$  parameters
  $:  time=@ud
      timing=@ud
      exe=@ud
      dest=@t
==
