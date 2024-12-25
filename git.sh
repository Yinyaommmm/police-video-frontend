git filter-branch -f --env-filter  '
if [ "$GIT_COMMITTER_EMAIL" = "8811940+angelfelixguo@user.noreply.gitee.com" ]
then
    GIT_COMMITTER_NAME="FavouriteTasty"
    GIT_COMMITTER_EMAIL="19307110112@fudan.edu.cn"
fi
if [ "$GIT_AUTHOR_EMAIL" = "8811940+angelfelixguo@user.noreply.gitee.com" ]
then
    GIT_AUTHOR_NAME="FavouriteTasty"
    GIT_AUTHOR_EMAIL="19307110112@fudan.edu.cn"
fi
if [ "$GIT_COMMITTER_EMAIL" = "20302010067@fudan.edu.cn" ]
then
    GIT_COMMITTER_NAME="FavouriteTasty"
    GIT_COMMITTER_EMAIL="19307110112@fudan.edu.cn"
fi
if [ "$GIT_AUTHOR_EMAIL" = "20302010067@fudan.edu.cn" ]
then
    GIT_AUTHOR_NAME="FavouriteTasty"
    GIT_AUTHOR_EMAIL="19307110112@fudan.edu.cn"
fi
' --tag-name-filter cat -- --branches --tags