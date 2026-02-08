# check for GITHUB_PM_TOKEN or MP_TOKEN
if [ "$GITHUB_PM_TOKEN" ]; then
  echo "Found GITHUB_PM_TOKEN, using it for submodule auth"
  token=$GITHUB_PM_TOKEN
elif [ "$MP_TOKEN" ]; then
  echo "Found MP_TOKEN, using it for submodule auth"
  token=$MP_TOKEN
else
  echo "No token found, skipping submodule auth"
fi

if [ "$token" ]; then
  # update the submodule url to use the token
  # .gitmodules has the url as https://github.com/blackpirateapps/shiny-robot.git
  # we want to change it to https://$token@github.com/blackpirateapps/shiny-robot.git
  sed -i "s|https://github.com/|https://$token@github.com/|g" .gitmodules
  
  # update git config to use the new url
  git submodule sync

  # init and update submodule
  git submodule update --init --recursive
  
  # fetch the latest content from the remote branch
  echo "Fetching latest content from remote..."
  git submodule update --remote --merge

  # if previous command failed, try to just clone it into content folder
  if [ $? -ne 0 ]; then
    echo "Submodule update failed, trying to clone directly"
    rm -rf content
    git clone https://$token@github.com/blackpirateapps/shiny-robot.git content
  fi
else
    git submodule update --init --recursive
fi
